const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const customersRouter = require('./routes/customers');

// 加载环境变量
dotenv.config();

// 初始化 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件目录
app.use('/uploads', express.static('uploads'));

// 引入 customers 路由
app.use('/api/customers', customersRouter);

// 默认路由
app.get('/', (req, res) => {
    res.send('欢迎使用算力云平台 API');
});

// 连接 MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calculate-cloud';

mongoose.connect(MONGO_URI) // 直接连接，不传递任何选项
    .then(() => {
        console.log('成功连接 MongoDB');
        app.listen(PORT, () => {
            console.log(`服务器运行在端口: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB 连接失败', err);
    });