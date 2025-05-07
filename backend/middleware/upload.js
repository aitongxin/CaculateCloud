const multer = require('multer');
const path = require('path');

// 配置存储
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('请上传有效的图片格式 (jpeg, jpg, png, gif, webp)'));
};

// 导出上传处理器
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 限制5MB
  fileFilter
});

module.exports = upload; 