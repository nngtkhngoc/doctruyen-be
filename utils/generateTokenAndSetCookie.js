import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user_id, role, res) => {
  const token = jwt.sign(
    {
      user_id: user_id,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    }
  );

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //ms
    httpOnly: true, //prevent XSS attacks cross-site scripting attack
    sameSite: "none", //CSRF attack
    secure: true,
  });
};

export default generateTokenAndSetCookie;
