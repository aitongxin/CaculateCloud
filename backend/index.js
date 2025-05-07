const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件目录
app.use('/uploads', express.static('uploads'));

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banner', require('./routes/banner'));
app.use('/api/merchant', require('./routes/merchant'));
app.use('/api/computing', require('./routes/computing'));

// 默认路由
app.get('/', (req, res) => {
  res.send('欢迎使用算力云平台API');
});

// 连接MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calculate-cloud';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('成功连接MongoDB');
    app.listen(PORT, () => {
      console.log(`服务器运行在端口: ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB连接失败', err);
  }); 