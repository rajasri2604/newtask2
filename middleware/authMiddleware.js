const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

exports.managerOnly = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};
