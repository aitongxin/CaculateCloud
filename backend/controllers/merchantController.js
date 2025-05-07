const Merchant = require('../models/Merchant');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    获取所有商家
// @route   GET /api/merchant
// @access  Public
exports.getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find({ isVerified: true }).populate('user', 'username email');
    res.json(merchants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个商家
// @route   GET /api/merchant/:id
// @access  Public
exports.getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('user', 'username email');

    if (merchant) {
      res.json(merchant);
    } else {
      res.status(404).json({ message: '商家不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建商家
// @route   POST /api/merchant
// @access  Private
exports.createMerchant = async (req, res) => {
  try {
    const { name, contact, description, website, email, address } = req.body;

    // 检查是否已经是商家
    const existingMerchant = await Merchant.findOne({ user: req.user._id });
    if (existingMerchant) {
      return res.status(400).json({ message: '用户已经注册为商家' });
    }

    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }

    const merchant = await Merchant.create({
      name,
      contact,
      description,
      logoUrl,
      website,
      email,
      address,
      user: req.user._id
    });

    // 更新用户角色为商家
    await User.findByIdAndUpdate(req.user._id, { role: 'merchant' });

    res.status(201).json(merchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新商家
// @route   PUT /api/merchant/:id
// @access  Private/Merchant
exports.updateMerchant = async (req, res) => {
  try {
    const { name, contact, description, website, email, address } = req.body;

    const merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
      return res.status(404).json({ message: '商家不存在' });
    }

    // 检查是否是商家本人或管理员
    if (merchant.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限更新此商家信息' });
    }

    // 更新图片（如果有上传新图片）
    let logoUrl = merchant.logoUrl;
    if (req.file) {
      // 删除旧图片
      if (merchant.logoUrl) {
        const oldLogoPath = path.join(__dirname, '..', merchant.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      logoUrl = `/uploads/${req.file.filename}`;
    }

    // 更新商家
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      {
        name,
        contact,
        description,
        logoUrl,
        website,
        email,
        address
      },
      { new: true }
    );

    res.json(updatedMerchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除商家
// @route   DELETE /api/merchant/:id
// @access  Private/Admin
exports.deleteMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
      return res.status(404).json({ message: '商家不存在' });
    }

    // 删除logo文件
    if (merchant.logoUrl) {
      const logoPath = path.join(__dirname, '..', merchant.logoUrl);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    // 更新用户角色回普通用户
    await User.findByIdAndUpdate(merchant.user, { role: 'user' });

    await Merchant.findByIdAndDelete(req.params.id);

    res.json({ message: '商家已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    验证商家
// @route   PUT /api/merchant/:id/verify
// @access  Private/Admin
exports.verifyMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
      return res.status(404).json({ message: '商家不存在' });
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    res.json(updatedMerchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};