const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// 生成JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, password, mobile, email, role = 'user' } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ 
      $or: [
        { username },
        { mobile: mobile ? mobile : undefined }
      ] 
    });

    if (userExists) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 创建用户
    const user = await User.create({
      username,
      password,
      mobile,
      email,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    登录用户
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });

    // 检查用户是否存在和密码是否正确
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    通过手机号登录
// @route   POST /api/auth/login/mobile
// @access  Public
exports.loginMobile = async (req, res) => {
  try {
    const { mobile, verifyCode } = req.body;

    // 这里应该有验证验证码的逻辑
    // 实际项目中，应该通过查询数据库或Redis中的验证码来验证
    // 简化处理，假设验证码为 '123456'
    if (verifyCode !== '123456') {
      return res.status(400).json({ message: '验证码错误' });
    }

    // 查找用户
    let user = await User.findOne({ mobile });

    // 如果用户不存在，创建新用户
    if (!user) {
      user = await User.create({
        username: `user_${mobile}`,
        password: Math.random().toString(36).slice(-8),
        mobile
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    发送验证码
// @route   POST /api/auth/send-verify-code
// @access  Public
exports.sendVerifyCode = async (req, res) => {
  try {
    const { mobile } = req.body;

    // 在实际项目中，这里应该调用短信API发送验证码
    // 为了简化，这里只返回成功
    res.json({ message: '验证码已发送' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 