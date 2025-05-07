const Computing = require('../models/Computing');

// @desc    获取所有算力资源
// @route   GET /api/computing
// @access  Public
exports.getComputingResources = async (req, res) => {
  try {
    const { type } = req.query;
    
    // 如果提供了type参数，按类型筛选
    const filter = type ? { type, available: true } : { available: true };
    
    const resources = await Computing.find(filter).sort({ order: 1 });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个算力资源
// @route   GET /api/computing/:id
// @access  Public
exports.getComputingById = async (req, res) => {
  try {
    const resource = await Computing.findById(req.params.id);

    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: '算力资源不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建算力资源
// @route   POST /api/computing
// @access  Private/Admin
exports.createComputing = async (req, res) => {
  try {
    const { 
      name, 
      model, 
      specs, 
      price, 
      unit, 
      type, 
      description, 
      available, 
      order 
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const resource = await Computing.create({
      name,
      model,
      specs,
      price,
      unit,
      type,
      imageUrl,
      description,
      available,
      order
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新算力资源
// @route   PUT /api/computing/:id
// @access  Private/Admin
exports.updateComputing = async (req, res) => {
  try {
    const { 
      name, 
      model, 
      specs, 
      price, 
      unit, 
      type, 
      description, 
      available, 
      order 
    } = req.body;

    const resource = await Computing.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: '算力资源不存在' });
    }

    // 更新图片（如果有上传新图片）
    let imageUrl = resource.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 更新资源
    const updatedResource = await Computing.findByIdAndUpdate(
      req.params.id,
      {
        name,
        model,
        specs,
        price,
        unit,
        type,
        imageUrl,
        description,
        available,
        order
      },
      { new: true }
    );

    res.json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除算力资源
// @route   DELETE /api/computing/:id
// @access  Private/Admin
exports.deleteComputing = async (req, res) => {
  try {
    const resource = await Computing.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: '算力资源不存在' });
    }

    await Computing.findByIdAndDelete(req.params.id);

    res.json({ message: '算力资源已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 