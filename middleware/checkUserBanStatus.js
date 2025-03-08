export const checkUserBanStatus = (req, res, next) => {
  try {
    if (req.is_banned)
      return res.status(401).json({
        success: false,
        message: "Access denied. The user is banned.",
      });
    next();
  } catch (error) {
    console.log("Error checking user ban status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
