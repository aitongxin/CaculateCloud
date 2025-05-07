const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// @desc    获取所有Banner
// @route   GET /api/banner
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const { type } = req.query;
    
    // 如果提供了type参数，按类型筛选
    const filter = type ? { type, isActive: true } : { isActive: true };
    
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个Banner
// @route   GET /api/banner/:id
// @access  Public
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      res.json(banner);
    } else {
      res.status(404).json({ message: 'Banner不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建Banner
// @route   POST /api/banner
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, targetUrl, type, order, isActive } = req.body;

    // 检查是否上传了图片
    if (!req.file) {
      return res.status(400).json({ message: '请上传Banner图片' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      subtitle,
      imageUrl,
      targetUrl,
      type,
      order,
      isActive
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新Banner
// @route   PUT /api/banner/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const { title, subtitle, targetUrl, type, order, isActive } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner不存在' });
    }

    // 更新图片（如果有上传新图片）
    let imageUrl = banner.imageUrl;
    if (req.file) {
      // 删除旧图片
      const oldImagePath = path.join(__dirname, '..', banner.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 更新Banner
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        imageUrl,
        targetUrl,
        type,
        order,
        isActive
      },
      { new: true }
    );

    res.json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除Banner
// @route   DELETE /api/banner/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner不存在' });
    }

    // 删除图片文件
    const imagePath = path.join(__dirname, '..', banner.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({ message: 'Banner已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 