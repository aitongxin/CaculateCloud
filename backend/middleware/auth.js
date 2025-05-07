const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// 验证用户是否已登录
exports.protect = async (req, res, next) => {
  let token;

  // 检查请求头中是否有token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // 把用户信息添加到请求中
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: '未授权，token失效' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: '未授权，没有token' });
  }
};

// 验证用户是否为管理员
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '没有管理员权限' });
  }
};

// 验证用户是否为商家
exports.merchant = (req, res, next) => {
  if (req.user && (req.user.role === 'merchant' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: '没有商家权限' });
  }
}; 