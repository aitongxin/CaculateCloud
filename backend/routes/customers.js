const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerName: String,
    companyName: String,
    contact: String,
    deviceDescription: String
});

const Customer = mongoose.model('Customer', CustomerSchema);

router.get('/', async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: '获取客户信息时出错', error: error.message });
    }
});

module.exports = router;