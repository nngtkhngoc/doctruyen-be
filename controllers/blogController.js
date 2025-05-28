import { prisma } from "../config/db.js";
import { createBlogValidator } from "../validation/blogValidation.js";
import cloudinary from "../config/cloudinary.js";

export const getAllBlogs = async (req, res) => {
  let { limit, page, filter_value } = req.query;

  try {
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page) || 1;

    let whereCondition = {};
    if (filter_value) {
      whereCondition = {
        OR: [
          { title: { contains: filter_value, mode: "insensitive" } },
          {
            author: {
              username: { contains: filter_value, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const blogs = await prisma.blogs.findMany({
      where: whereCondition,
      ...(pageSize > 0
        ? { take: pageSize, skip: (currentPage - 1) * pageSize }
        : {}),
      orderBy: { created_at: "desc" },
      include: { author: { select: { username: true } } },
    });

    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.log("Error get all blogs", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getBlog = async (req, res) => {
  const { blog_id } = req.params;
  try {
    const blog = await prisma.blogs.findUnique({
      where: { blog_id },
      include: { author: { select: { username: true } } },
    });

    if (blog) {
      return res.status(200).json({ success: true, data: blog });
    }

    return res.status(404).json({ success: false, message: "Blog not found" });
  } catch (error) {
    console.log("Error get details blog", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createBlog = async (req, res) => {
  const { user_id } = req;
  const data = req.body;
  try {
    data.author_id = user_id;
    const uploadRes = await cloudinary.uploader.upload(data.cover_image);
    data.cover_image = uploadRes.secure_url;

    await createBlogValidator.validateAsync(data);

    const createdBlog = await prisma.blogs.create({ data });

    return res.status(200).json({ success: true, data: createdBlog });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map(err => err.message),
      });
    }

    console.log("Error create blog", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateBlog = async (req, res) => {
  const { blog_id } = req.params;
  const data = req.body;
  try {
    data.author_id = req.user_id;
    const uploadRes = await cloudinary.uploader.upload(data.cover_image);
    data.cover_image = uploadRes.secure_url;
    await createBlogValidator.validateAsync(data);
    const updatedBlog = await prisma.blogs.update({
      where: { blog_id },
      data,
    });
    return res.status(201).json({
      success: true,
      message: "Blog updated",
      data: updatedBlog,
    });
  } catch (err) {
    console.log(err);
    res.status(501).json({
      success: false,
    });
  }
};

export const deleteBlog = async (req, res) => {
  const { blog_id } = req.params;

  try {
    await prisma.blogs.delete({ where: { blog_id } });
    return res.status(200).json({
      success: true,
      message: "Delete blog successfully",
    });
  } catch (error) {
    console.log("Error delete blog", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
