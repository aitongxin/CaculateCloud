const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 获取所有Banner
router.get('/', bannerController.getBanners);

// 获取单个Banner
router.get('/:id', bannerController.getBannerById);

// 创建Banner - 需要管理员权限和图片上传
router.post('/', protect, admin, upload.single('image'), bannerController.createBanner);

// 更新Banner - 需要管理员权限和可选的图片上传
router.put('/:id', protect, admin, upload.single('image'), bannerController.updateBanner);

// 删除Banner - 需要管理员权限
router.delete('/:id', protect, admin, bannerController.deleteBanner);

module.exports = router; 