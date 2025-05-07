const express = require('express');
const router = express.Router();
const computingController = require('../controllers/computingController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 获取所有算力资源
router.get('/', computingController.getComputingResources);

// 获取单个算力资源
router.get('/:id', computingController.getComputingById);

// 创建算力资源 - 需要管理员权限和可选的图片上传
router.post('/', protect, admin, upload.single('image'), computingController.createComputing);

// 更新算力资源 - 需要管理员权限和可选的图片上传
router.put('/:id', protect, admin, upload.single('image'), computingController.updateComputing);

// 删除算力资源 - 需要管理员权限
router.delete('/:id', protect, admin, computingController.deleteComputing);

module.exports = router; 