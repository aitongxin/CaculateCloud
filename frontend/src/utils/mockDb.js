/**
 * 模拟数据库
 * 存储用户账号、验证码等信息
 */

// 模拟用户数据库
export const mockUsers = [
  { username: 'admin', password: '123456', role: 'admin', id: 'admin001' },
  { username: 'user1', password: '123456', role: 'user', id: 'user001' },
  { username: 'merchant', password: '123456', role: 'merchant', id: 'merchant001' },
  { username: 'jjjj123123', password: '123456', role: 'user', id: 'xaxaxaxax123' }
];

// 模拟手机号验证码数据库
export const mockPhoneCodes = new Map();

// 添加新用户
export function addUser(user) {
  // 检查用户名是否存在
  const exists = mockUsers.some(u => u.username === user.username);
  if (exists) {
    return { success: false, message: '用户名已存在' };
  }
  
  // 添加新用户
  mockUsers.push(user);
  console.log('注册成功，当前用户列表:', mockUsers);
  return { success: true };
}

// 验证用户登录
export function verifyUser(username, password) {
  return mockUsers.find(u => u.username === username && u.password === password);
}

// 设置验证码
export function setVerifyCode(mobile, code) {
  mockPhoneCodes.set(mobile, code);
}

// 验证手机验证码
export function verifyCode(mobile, code) {
  return mockPhoneCodes.get(mobile) === code;
}

// 生成验证码
export function generateVerifyCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
} 