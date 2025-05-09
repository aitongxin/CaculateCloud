const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerName: String,
    companyName: String,
    contact: String,
    deviceDescription: String
});

const Customer = mongoose.model('Customer', CustomerSchema);
console.log('Customer 模型定义成功');

module.exports = Customer;