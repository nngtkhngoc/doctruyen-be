import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies);
  if (!token)
    return res.status(401).json({ success: false, message: "Access Denied" });

  try {
    console.log(token, "TOKEN");
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified, "VC");
    if (!verified) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: verified.user_id },
    });

    req.user_id = user.user_id;
    req.role = user.role;
    req.is_banned = user.is_banned;
    console.log("PASS");
    next();
  } catch (err) {
    console.log("Error verify token:", err);
    return res.status(500).send("Internal Server Error");
  }
};
