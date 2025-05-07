const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { protect, admin, merchant } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 获取所有商家
router.get('/', merchantController.getMerchants);

// 获取单个商家
router.get('/:id', merchantController.getMerchantById);

// 创建商家 - 需要登录和可选的Logo上传
router.post('/', protect, upload.single('logo'), merchantController.createMerchant);

// 更新商家 - 需要商家本人或管理员权限和可选的Logo上传
router.put('/:id', protect, merchant, upload.single('logo'), merchantController.updateMerchant);

// 删除商家 - 需要管理员权限
router.delete('/:id', protect, admin, merchantController.deleteMerchant);

// 验证商家 - 需要管理员权限
router.put('/:id/verify', protect, admin, merchantController.verifyMerchant);

module.exports = router; 