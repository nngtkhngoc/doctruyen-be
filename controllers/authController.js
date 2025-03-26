import bcrypt from "bcryptjs";
import {
  signUpValidator,
  resetPasswordValidator,
  updateUserValidator,
} from "../validation/authValidation.js";
import { prisma } from "../config/db.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import generateToken from "../utils/generateToken.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../config/nodemailer.js";
import cloudinary from "../config/cloudinary.js";

export const getAllUsers = async (req, res) => {
  let {
    limit,
    page,
    sort = "username",
    order = "desc",
    filter_value,
  } = req.query;

  try {
    if (!["username", "fullname", "created_at"].includes(sort)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sort field" });
    }

    if (!["asc", "desc"].includes(order)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order field" });
    }

    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;

    let whereCondition = {};
    if (filter_value) {
      whereCondition = {
        OR: [
          { username: { contains: filter_value, mode: "insensitive" } },
          { fullname: { contains: filter_value, mode: "insensitive" } },
          { email: { contains: filter_value, mode: "insensitive" } },
          { phone_number: { contains: filter_value, mode: "insensitive" } },
        ],
      };
    }

    const users = await prisma.users.findMany({
      where: whereCondition,
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { [sort]: order },
      include: {
        story_likes: {
          select: { story: { select: { title: true } }, liked_at: true },
        },
        story_comments: {
          select: {
            story: { select: { title: true } },
            commented_at: true,
            comment_id: true,
            content: true,
          },
        },
        story_ratings: {
          select: {
            story: { select: { title: true } },
            rated_at: true,
            score: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error get all users", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await prisma.users.findUnique({
      omit: {
        password: true,
      },
      where: { user_id },
      include: {
        story_likes: true,
        story_comments: true,
        story_ratings: true,
        blogs: true,
      },
    });

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.log("Error get user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  const data = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await signUpValidator.validateAsync(data);

    const [checkUsername, checkEmail, checkPhoneNumber] = await Promise.all([
      await prisma.users.findUnique({ where: { username: data.username } }),
      await prisma.users.findUnique({ where: { email: data.email } }),
      await prisma.users.findUnique({
        where: { phone_number: data.phone_number },
      }),
    ]);

    if (checkEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    if (checkUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    if (checkPhoneNumber) {
      return res
        .status(409)
        .json({ success: false, message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: data.username,
        phone_number: data.phone_number,
        email: data.email,
        password: hashedPassword,
        role: data.role ? data.role : "USER",
        profile_pic: data.profile_pic,
      },
    });

    generateTokenAndSetCookie(newUser.user_id, newUser.role, res);

    return res
      .status(200)
      .json({ success: true, message: "Sign up sucesfully", data: newUser });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error signing up: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide identifier and password",
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone_number: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(406)
        .json({ success: false, message: "Incorrect password" });
    }

    generateTokenAndSetCookie(user.user_id, user.role, res);

    return res.json({
      success: true,
      data: {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone_number: user.phone_number,
        profile_pic: user.profile_pic,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.log("Error sign in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    });

    return res
      .status(200)
      .json({ success: true, message: "Sign out successfully" });
  } catch (error) {
    console.log("Error sign out:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const data = req.body;
  const user_id = req.user_id;
  try {
    await updateUserValidator.validateAsync(data);

    if (data.profile_pic) {
      const uploadRes = await cloudinary.uploader.upload(data.profile_pic);
      data.profile_pic = uploadRes.secure_url;
    }

    const updatedUser = await prisma.users.update({ where: { user_id }, data });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Update user successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error update user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getVerificationToken = async (req, res) => {
  const { user_id } = req;
  try {
    const user = await prisma.users.findUnique({ where: { user_id } });

    if (user) {
      if (!user.is_verified) {
        const verification_token = generateToken();

        await prisma.users.update({
          where: { user_id },
          data: {
            verification_token: verification_token,
            verification_token_expires_at: new Date(Date.now() + 5 * 60 * 1000),
          },
        });

        await sendVerificationEmail(user.email, verification_token);

        return res
          .status(200)
          .json({ success: true, message: "Send Token successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "User has already verified" });
      }
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.log("Error send token", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { verification_token } = req.body;
  const { user_id } = req;

  try {
    const user = await prisma.users.findUnique({
      where: {
        verification_token,
        verification_token_expires_at: { gt: new Date() },
        user_id,
      },
    });

    if (user) {
      await prisma.users.update({
        where: { verification_token },
        data: {
          is_verified: true,
          verification_token: null,
          verification_token_expires_at: null,
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Email verified successfuly" });
    }

    return res.status(404).json({ success: false, message: "Invalid token" });
  } catch (error) {
    console.log("Error verify email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internet Server Error" });
  }
};

export const getResetPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const reset_password_token = generateToken();

    await prisma.users.update({
      where: { email },
      data: {
        reset_password_token: reset_password_token,
        reset_password_token_expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendResetPasswordEmail(user.email, reset_password_token);

    return res
      .status(200)
      .json({ success: true, message: "Send mail succesfully" });
  } catch (error) {
    console.log("Error send reset password mail:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { reset_password_token } = req.params;
  const { new_password, confirm_new_password } = req.body;
  try {
    await resetPasswordValidator.validateAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        reset_password_token,
        reset_password_token_expires_at: { gt: new Date() },
      },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { reset_password_token },
        data: {
          password: hashedPassword,
          reset_password_token: null,
          reset_password_token_expires_at: null,
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Reset password successfully" });
    }

    return res.status(400).json({ sucess: false, message: "Invalid token" });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error reset password: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const banUser = async (req, res) => {
  const { user_id } = req.body;
  try {
    const bannedUser = await prisma.users.update({
      where: { user_id },
      data: { is_banned: true },
    });

    if (!bannedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Ban user successfully" });
  } catch (error) {
    console.log("Error ban user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
