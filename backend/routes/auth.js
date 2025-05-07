const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// 注册新用户
router.post('/register', authController.register);

// 用户登录 (账号密码)
router.post('/login', authController.login);

// 手机登录
router.post('/login/mobile', authController.loginMobile);

// 发送验证码
router.post('/send-verify-code', authController.sendVerifyCode);

// 获取当前用户信息
router.get('/me', protect, authController.getCurrentUser);

module.exports = router; 