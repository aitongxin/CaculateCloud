/**
 * 通用数据
 * 在不同组件间共享的数据和常量
 */

// Banner数据
export const banners = [
  { 
    id: 1, 
    title: '欢迎使用算力云平台', 
    subtitle: '高性能计算资源随时可用', 
    type: 'common', 
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1920&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: '商家入驻有礼', 
    subtitle: '加入我们的生态系统', 
    type: 'merchant', 
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1920&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: '用户专享优惠', 
    subtitle: '新用户首单立减', 
    type: 'user', 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop'
  },
];

// 算力资源数据
export const computingResources = [
  { id: 1, model: 'NVIDIA H100', specs: '半精 19.7 TFLOPS / 900GB/s', type: 'AI算力', price: 8.00, unit: '小时', available: true },
  { id: 2, model: 'NVIDIA A100', specs: '半精 9.7 TFLOPS / 600GB/s', type: '渲染算力', price: 5.00, unit: '小时', available: true },
  { id: 3, model: 'NVIDIA T4', specs: '16GB VRAM / 300GB/s', type: '普通算力', price: 2.00, unit: '小时', available: true },
];

// 商家数据
export const merchants = [
  { id: 1, name: '云算科技', contact: '13800138000', isVerified: true },
  { id: 2, name: '数智算力', contact: '13900139000', isVerified: false },
];

// 常见问题数据
export const faqs = [
  { id: 1, question: '如何选择GPU?', answer: '根据您的需求选择合适的GPU型号，AI训练推荐H100/A100，渲染推荐RTX系列。', order: 0, active: true },
  { id: 2, question: '如何上传数据?', answer: '登录后，进入"文件存储"页面，点击"上传"按钮即可上传您的数据。', order: 1, active: true },
  { id: 3, question: '如何开具发票?', answer: '在"发票管理"页面，点击"申请开票"，填写发票信息后提交审核。', order: 2, active: true },
  { id: 4, question: '如何成为炼丹会员?', answer: '完成实名认证后，在"会员中心"页面升级成为炼丹会员，享受算力折扣和专属服务。', order: 3, active: true },
]; 