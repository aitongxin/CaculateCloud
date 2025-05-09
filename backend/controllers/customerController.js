const Customer = require('../models/Customer');

// 创建客户（处理 POST /api/customers）
exports.createCustomer = async(req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取所有客户（处理 GET /api/customers）
exports.getCustomers = async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};