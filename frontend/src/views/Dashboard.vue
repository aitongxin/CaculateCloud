<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <!-- 侧边菜单 -->
      <div class="dashboard-menu">
        <h3 class="menu-title">控制台</h3>
        <div 
          v-for="(item, index) in menuItems" 
          :key="index" 
          :class="['menu-item', { active: activeMenu === item.key }]"
          @click="activeMenu = item.key"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="dashboard-content">
        <!-- 用户资源总览 -->
        <div v-if="activeMenu === 'dashboard'" class="content-section">
          <div class="dashboard-overview">
            <div class="instance-counts">
              <div class="count-box">
                <div class="count blue">1</div>
                <div class="count-label">实例</div>
              </div>
              <div class="count-box">
                <div class="count blue">1</div>
                <div class="count-label">运行中</div>
              </div>
              <div class="count-box">
                <div class="count yellow">0</div>
                <div class="count-label">即将到期</div>
              </div>
              <div class="count-box">
                <div class="count orange">0</div>
                <div class="count-label">即将释放</div>
              </div>
            </div>
            
            <div class="alert-settings">
              <div class="alert-item">
                <span>到期预警</span>
                <el-switch v-model="expireAlert" />
                <span>已开启</span>
              </div>
              <div class="alert-item">
                <span>余额预警</span>
                <el-switch v-model="balanceAlert" />
                <span>已开启</span>
              </div>
            </div>
          </div>
          
          <!-- 用户存储使用情况 -->
          <div class="storage-overview">
            <div class="storage-cards">
              <div class="storage-card">
                <h3>付费扩容容量</h3>
                <div class="storage-size">0<span>GB</span></div>
                <div class="storage-desc">实例数据盘</div>
              </div>
              <div class="storage-card">
                <h3>付费容量</h3>
                <div class="storage-size">0<span>GB</span></div>
                <div class="storage-desc">镜像</div>
              </div>
              <div class="storage-card">
                <h3>付费容量</h3>
                <div class="storage-size">0<span>GB</span></div>
                <div class="storage-desc">文件存储</div>
              </div>
            </div>
          </div>
          
          <!-- 账户余额 -->
          <div class="balance-card">
            <div class="balance-amount">
              <div class="balance">
                <span class="currency">￥</span>0.0
                <div class="balance-label">可用</div>
              </div>
              <div class="balance">
                <span class="currency">￥</span>0.0
                <div class="balance-label">冻结</div>
              </div>
            </div>
            <div class="voucher-info">
              <div>代金券：0张</div>
              <el-button type="primary" size="small">更多</el-button>
            </div>
          </div>
          
          <!-- 常见问题 -->
          <div class="faq-section">
            <h3>常见问题</h3>
            <div class="faq-list">
              <div v-for="faq in faqs" :key="faq.id" class="faq-item">{{ faq.question }}</div>
              <div class="faq-link">更多</div>
            </div>
          </div>
        </div>
        
        <!-- Banner管理 -->
        <div v-if="activeMenu === 'banner'" class="content-section">
          <div class="section-header">
            <h2>Banner管理</h2>
            <el-button type="primary" @click="showAddBanner">
              <el-icon><plus /></el-icon> 添加Banner
            </el-button>
          </div>
          
          <el-table :data="banners" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <el-tag :type="getBannerTypeTag(scope.row.type)">
                  {{ scope.row.type === 'common' ? '通用' : 
                     scope.row.type === 'merchant' ? '商家' : '用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template #default="scope">
                <el-image 
                  style="width: 100px; height: 40px" 
                  :src="scope.row.imageUrl" 
                  fit="cover"
                  :preview-src-list="[scope.row.imageUrl]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-switch v-model="scope.row.isActive" @change="updateBannerStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button size="small" @click="editBanner(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteBanner(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 算力资源管理 -->
        <div v-if="activeMenu === 'computing'" class="content-section">
          <div class="section-header">
            <h2>算力资源管理</h2>
            <el-button type="primary" @click="showComputingForm = true">
              <el-icon><plus /></el-icon> 添加算力资源
            </el-button>
          </div>
          
          <el-table :data="computingResources" style="width: 100%">
            <el-table-column prop="model" label="型号" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="price" label="价格">
              <template #default="scope">
                {{ scope.row.price }} 元/{{ scope.row.unit }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-switch v-model="scope.row.available" @change="updateResourceStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button size="small" @click="editComputing(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteComputing(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 实例管理 -->
        <div v-if="activeMenu === 'examples'" class="content-section">
          <div class="section-header">
            <h2>实例</h2>
            <el-button type="primary">
              <el-icon><plus /></el-icon> 租用实例
            </el-button>
          </div>
          
          <div class="examples-note">
            实例将在未付款15天会释放资源，实例释放全部数据丢失，释放前请及时做好备份。
          </div>
          
          <div class="examples-actions">
            <el-button type="primary">租用新实例</el-button>
            <div class="search-box">
              <el-input placeholder="搜索实例名称/ID" prefix-icon="Search" />
            </div>
          </div>
          
          <el-table :data="[]" style="width: 100%">
            <el-table-column prop="id" label="实例ID/名称" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="specs" label="规格详情" />
            <el-table-column prop="ip" label="本地地址" />
            <el-table-column prop="health" label="健康状态" />
            <el-table-column prop="payment" label="付费方式" />
            <el-table-column prop="expireTime" label="释放时间/停机时间" />
            <el-table-column prop="ssh" label="SSH登录" />
            <el-table-column prop="tools" label="快捷工具" />
            <el-table-column prop="actions" label="操作" />
          </el-table>
          
          <div class="empty-data">暂无数据</div>
          
          <div class="pagination">
            <span>共 0 条</span>
            <el-pagination layout="prev, pager, next" :total="0" :page-size="10" />
          </div>
        </div>
        
        <!-- 账号安全 -->
        <div v-if="activeMenu === 'security'" class="content-section">
          <h2>账号安全</h2>
          
          <div class="security-card">
            <div class="security-item">
              <div class="item-title">登录密码</div>
              <div class="item-desc">安全性高的密码可以使账号更安全。建议定期更换密码，设置一个包含字母和数字且长度超过8位的密码</div>
              <div class="item-status">
                <el-tag type="danger">未设置</el-tag>
                <el-button type="primary" plain size="small">设置</el-button>
              </div>
            </div>
            
            <div class="security-item">
              <div class="item-title">手机绑定</div>
              <div class="item-desc">您已绑定了手机136****6700您的手机号可以用于登录、找回密码等</div>
              <div class="item-status">
                <el-tag type="success">已绑定</el-tag>
                <el-button type="primary" plain size="small">修改</el-button>
              </div>
            </div>
            
            <div class="security-item">
              <div class="item-title">实名认证</div>
              <div class="item-desc">实名认证后可以使用AutoDL更完整的功能，如开开具实例的自定义服务等</div>
              <div class="item-status">
                <el-tag type="danger">未认证</el-tag>
                <el-button type="primary" plain size="small">立即认证</el-button>
              </div>
            </div>
            
            <div class="security-item">
              <div class="item-title">企业认证</div>
              <div class="item-desc">企业认证可以进行更优惠力度的商业合作与洽谈</div>
              <div class="item-status">
                <el-tag type="danger">未认证</el-tag>
                <el-button type="primary" plain size="small">立即认证</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 文件存储 -->
        <div v-if="activeMenu === 'storage'" class="content-section">
          <h2>文件存储</h2>
          
          <div class="storage-info">
            <p>文件存储支持实例间和外部共享的文件，您在FTP或其他途径上上传的文件存储在这里。</p>
            <div class="storage-quota">
              <span>0.00GB (今天容量使用情况：0.000GB，剩余容量80G)</span>
              <el-button type="primary" plain size="small">查看计费说明</el-button>
            </div>
          </div>
          
          <div class="storage-actions">
            <el-button type="primary">上传</el-button>
          </div>
          
          <div class="storage-table">
            <el-table :data="[]" style="width: 100%">
              <el-table-column prop="name" label="文件名称" />
              <el-table-column prop="size" label="大小" />
              <el-table-column prop="time" label="更新时间" />
              <el-table-column prop="actions" label="操作" />
            </el-table>
            
            <div class="empty-data">暂无数据</div>
            
            <div class="pagination">
              <span>共 0 条</span>
              <el-pagination layout="prev, pager, next" :total="0" :page-size="10" />
            </div>
          </div>
        </div>
        
        <!-- 代金券 -->
        <div v-if="activeMenu === 'vouchers'" class="content-section">
          <h2>代金券</h2>
          
          <div class="voucher-info">
            <div class="voucher-balance">可用代金券: <span class="amount">¥0.00</span></div>
            <el-button type="primary">兑换和充值</el-button>
          </div>
          
          <div class="voucher-tabs">
            <el-tabs v-model="voucherActiveTab">
              <el-tab-pane label="生效中" name="active"></el-tab-pane>
              <el-tab-pane label="已失效" name="expired"></el-tab-pane>
            </el-tabs>
          </div>
          
          <div class="voucher-table">
            <el-table :data="[]" style="width: 100%">
              <el-table-column prop="name" label="代金券名称" />
              <el-table-column prop="conditions" label="使用条件" />
              <el-table-column prop="effectiveTime" label="生效时间" />
              <el-table-column prop="expireTime" label="失效时间" />
              <el-table-column prop="autoDeduction" label="自动抵扣红消费" />
              <el-table-column prop="amount" label="余额/原始面值" />
            </el-table>
            
            <div class="empty-data">暂无数据</div>
            
            <div class="pagination">
              <span>共 0 条</span>
              <el-pagination layout="prev, pager, next" :total="0" :page-size="10" />
            </div>
          </div>
        </div>
        
        <!-- 收支明细 -->
        <div v-if="activeMenu === 'transaction'" class="content-section">
          <h2>收支明细</h2>
          
          <div class="transaction-filter">
            <el-radio-group v-model="transactionTimeType">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="start">开始时间</el-radio-button>
              <el-radio-button label="end">结束时间</el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="transaction-table">
            <el-table :data="transactions" style="width: 100%">
              <el-table-column prop="id" label="流水号" />
              <el-table-column prop="time" label="交易时间" />
              <el-table-column prop="type" label="收入类型" />
              <el-table-column prop="status" label="交易类型" />
              <el-table-column prop="source" label="交易来源" />
              <el-table-column prop="amount" label="交易金额" />
              <el-table-column prop="balance" label="余额" />
              <el-table-column prop="notes" label="备注" />
            </el-table>
            
            <div class="pagination">
              <span>共 1 条</span>
              <el-pagination layout="prev, pager, next" :total="1" :page-size="10" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Banner表单对话框 -->
    <el-dialog v-model="showBannerForm" title="Banner管理" width="600px">
      <el-form :model="bannerForm" ref="bannerFormRef" label-width="80px" :rules="bannerRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="bannerForm.title" placeholder="请输入Banner标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="bannerForm.subtitle" placeholder="请输入Banner副标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="bannerForm.type" placeholder="请选择Banner类型" style="width: 100%">
            <el-option label="通用" value="common" />
            <el-option label="商家" value="merchant" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接" prop="targetUrl">
          <el-input v-model="bannerForm.targetUrl" placeholder="请输入Banner点击跳转链接" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-upload
            class="banner-uploader"
            action="#"
            :http-request="handleBannerUpload"
            :show-file-list="false"
            :before-upload="beforeBannerUpload"
          >
            <img v-if="bannerForm.imageUrl" :src="bannerForm.imageUrl" class="banner-image" />
            <el-icon v-else class="banner-uploader-icon"><plus /></el-icon>
          </el-upload>
          <div class="banner-upload-tip">
            推荐尺寸: 1920×500像素，格式: JPG/PNG，大小不超过5MB
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-switch
            v-model="bannerForm.isActive"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBannerForm = false">取消</el-button>
          <el-button type="primary" @click="saveBanner" :loading="submitting">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 算力资源表单对话框 -->
    <el-dialog v-model="showComputingForm" title="算力资源管理" width="600px">
      <el-form :model="computingForm" ref="computingFormRef" label-width="80px" :rules="computingRules">
        <el-form-item label="型号" prop="model">
          <el-input v-model="computingForm.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="规格" prop="specs">
          <el-input v-model="computingForm.specs" placeholder="请输入设备规格" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="computingForm.type" placeholder="请选择算力类型" style="width: 100%">
            <el-option label="AI算力" value="AI算力" />
            <el-option label="渲染算力" value="渲染算力" />
            <el-option label="普通算力" value="普通算力" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="computingForm.price" :precision="2" :step="0.1" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="computingForm.unit" placeholder="如: 小时、天" />
        </el-form-item>
        <el-form-item label="状态" prop="available">
          <el-switch
            v-model="computingForm.available"
            active-text="可用"
            inactive-text="不可用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showComputingForm = false">取消</el-button>
          <el-button type="primary" @click="saveComputing" :loading="submitting">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Picture, DataLine, ShoppingCart, User, Plus, 
  Setting, Document, ChatLineRound, Upload, 
  HomeFilled, Monitor, FolderOpened, PictureFilled, 
  DataAnalysis, Money, Wallet, Tickets, Discount, Lock
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';

// 导入常见问题数据
import { faqs as faqsData } from '../utils/commonData';

// 常见问题数据
const faqs = ref(faqsData.filter(faq => faq.active));

// 菜单状态
const activeMenu = ref('dashboard');
const menuItems = [
  { key: 'dashboard', label: '主页', icon: 'HomeFilled' },
  { key: 'examples', label: '实例', icon: 'Monitor' },
  { key: 'storage', label: '文件存储', icon: 'FolderOpened' },
  { key: 'image', label: '镜像', icon: 'PictureFilled' },
  { key: 'dataset', label: '公开数据集', icon: 'DataAnalysis' },
  { key: 'cost', label: '费用', icon: 'Money' },
  { key: 'transaction', label: '收支明细', icon: 'Wallet' },
  { key: 'orders', label: '我的订单', icon: 'Tickets' },
  { key: 'vouchers', label: '代金券', icon: 'Discount' },
  { key: 'developer', label: '发票管理', icon: 'Document' },
  { key: 'account', label: '账号', icon: 'User' },
  { key: 'security', label: '账号安全', icon: 'Lock' },
];

// Dashboard page states
const expireAlert = ref(true);
const balanceAlert = ref(true);
const voucherActiveTab = ref('active');
const transactionTimeType = ref('all');

// Sample transaction data
const transactions = ref([
  { 
    id: '17430023801541265', 
    time: '2023-04-30 16:48:00', 
    type: '收入', 
    status: '充值', 
    source: '微信', 
    amount: '￥ 5.00', 
    balance: '￥ 3.00', 
    notes: '-' 
  }
]);

// 表单显示控制
const showBannerForm = ref(false);
const showComputingForm = ref(false);
const submitting = ref(false);

// Banner数据
const banners = ref([
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
]);

// 算力资源数据
const computingResources = ref([
  { id: 1, model: 'NVIDIA H100', specs: '半精 19.7 TFLOPS / 900GB/s', type: 'AI算力', price: 8.00, unit: '小时', available: true },
  { id: 2, model: 'NVIDIA A100', specs: '半精 9.7 TFLOPS / 600GB/s', type: '渲染算力', price: 5.00, unit: '小时', available: true },
  { id: 3, model: 'NVIDIA T4', specs: '16GB VRAM / 300GB/s', type: '普通算力', price: 2.00, unit: '小时', available: true },
]);

// 商家数据
const merchants = ref([
  { id: 1, name: '云算科技', contact: '13800138000', isVerified: true },
  { id: 2, name: '数智算力', contact: '13900139000', isVerified: false },
]);

// Banner表单
const bannerFormRef = ref(null);
const bannerForm = reactive({
  id: null,
  title: '',
  subtitle: '',
  type: 'common',
  targetUrl: '',
  imageUrl: '',
  isActive: true
});

// Banner表单验证规则
const bannerRules = {
  title: [
    { required: true, message: '请输入Banner标题', trigger: 'blur' },
    { max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
  ],
  subtitle: [
    { max: 100, message: '副标题长度不能超过100个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择Banner类型', trigger: 'change' }
  ],
  imageUrl: [
    { required: true, message: '请上传Banner图片', trigger: 'change' }
  ]
};

// 算力资源表单
const computingFormRef = ref(null);
const computingForm = reactive({
  id: null,
  model: '',
  specs: '',
  type: 'AI算力',
  price: 0,
  unit: '小时',
  available: true
});

// 算力资源表单验证规则
const computingRules = {
  model: [
    { required: true, message: '请输入设备型号', trigger: 'blur' }
  ],
  specs: [
    { required: true, message: '请输入设备规格', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择算力类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请输入计费单位', trigger: 'blur' }
  ]
};

// 获取Banner类型对应的标签类型
const getBannerTypeTag = (type) => {
  const map = {
    common: '',
    merchant: 'success',
    user: 'warning'
  };
  return map[type] || '';
};

// 显示添加Banner表单
const showAddBanner = () => {
  // 重置表单
  Object.keys(bannerForm).forEach(key => {
    if (key !== 'type' && key !== 'isActive') {
      bannerForm[key] = key === 'id' ? null : '';
    }
  });
  showBannerForm.value = true;
};

// Banner相关操作
const editBanner = (banner) => {
  Object.assign(bannerForm, banner);
  showBannerForm.value = true;
};

// Banner上传前验证
const beforeBannerUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('上传图片只能是JPG/PNG/GIF格式!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过5MB!');
    return false;
  }
  return true;
};

// 处理Banner图片上传
const handleBannerUpload = (options) => {
  const { file } = options;
  
  // 在实际项目中，应该将文件上传到服务器
  // 这里简化为直接将文件转换为base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    bannerForm.imageUrl = reader.result;
  };
};

const saveBanner = async () => {
  if (!bannerFormRef.value) return;
  
  await bannerFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      
      try {
        // 模拟保存逻辑
        setTimeout(() => {
          if (bannerForm.id) {
            // 更新现有Banner
            const index = banners.value.findIndex(item => item.id === bannerForm.id);
            if (index !== -1) {
              banners.value[index] = { ...bannerForm };
            }
            ElMessage.success('Banner更新成功');
          } else {
            // 添加新Banner
            const newBanner = { ...bannerForm, id: Date.now() };
            banners.value.push(newBanner);
            ElMessage.success('Banner添加成功');
          }
          
          showBannerForm.value = false;
          submitting.value = false;
        }, 1000);
        
        // 在实际项目中，这里应该调用真实的API
        // const formData = new FormData();
        // for (const key in bannerForm) {
        //   if (key !== 'imageFile' && key !== 'id') {
        //     formData.append(key, bannerForm[key]);
        //   }
        // }
        // if (bannerForm.imageFile) {
        //   formData.append('image', bannerForm.imageFile);
        // }
        
        // if (bannerForm.id) {
        //   await axios.put(`/api/banner/${bannerForm.id}`, formData);
        // } else {
        //   await axios.post('/api/banner', formData);
        // }
      } catch (error) {
        console.error('保存Banner失败:', error);
        ElMessage.error('保存失败，请稍后再试');
        submitting.value = false;
      }
    }
  });
};

const deleteBanner = (banner) => {
  ElMessageBox.confirm('确定要删除这个Banner吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    banners.value = banners.value.filter(item => item.id !== banner.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

const updateBannerStatus = (banner) => {
  ElMessage.success(`Banner "${banner.title}" ${banner.isActive ? '已启用' : '已禁用'}`);
};

// 算力资源相关操作
const editComputing = (resource) => {
  Object.assign(computingForm, resource);
  showComputingForm.value = true;
};

const saveComputing = async () => {
  if (!computingFormRef.value) return;
  
  await computingFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      
      try {
        // 模拟保存逻辑
        setTimeout(() => {
          if (computingForm.id) {
            // 更新现有资源
            const index = computingResources.value.findIndex(item => item.id === computingForm.id);
            if (index !== -1) {
              computingResources.value[index] = { ...computingForm };
            }
            ElMessage.success('算力资源更新成功');
          } else {
            // 添加新资源
            const newResource = { ...computingForm, id: Date.now() };
            computingResources.value.push(newResource);
            ElMessage.success('算力资源添加成功');
          }
          
          showComputingForm.value = false;
          submitting.value = false;
        }, 1000);
      } catch (error) {
        console.error('保存算力资源失败:', error);
        ElMessage.error('保存失败，请稍后再试');
        submitting.value = false;
      }
    }
  });
};

const deleteComputing = (resource) => {
  ElMessageBox.confirm('确定要删除这个算力资源吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    computingResources.value = computingResources.value.filter(item => item.id !== resource.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

const updateResourceStatus = (resource) => {
  ElMessage.success(`算力资源 "${resource.model}" ${resource.available ? '已上线' : '已下线'}`);
};

// 商家相关操作
const verifyMerchant = (merchant) => {
  ElMessageBox.confirm('确定要审核通过这个商家吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = merchants.value.findIndex(item => item.id === merchant.id);
    if (index !== -1) {
      merchants.value[index].isVerified = true;
    }
    ElMessage.success('商家审核已通过');
  }).catch(() => {});
};

const deleteMerchant = (merchant) => {
  ElMessageBox.confirm('确定要删除这个商家吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    merchants.value = merchants.value.filter(item => item.id !== merchant.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 生命周期钩子
onMounted(async () => {
  // 在实际项目中，这里应该从API获取数据
  // fetchBanners();
  // fetchComputingResources();
  // fetchMerchants();
});
</script>

<style scoped>
.dashboard-page {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.dashboard-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-menu {
  width: 200px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  margin-right: 20px;
}

.menu-title {
  padding: 0 20px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.menu-item .el-icon {
  margin-right: 10px;
}

.dashboard-content {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* Dashboard overview styles */
.dashboard-overview {
  margin-bottom: 30px;
}

.instance-counts {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.count-box {
  text-align: center;
}

.count {
  font-size: 56px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 5px;
}

.count.blue {
  color: #409EFF;
}

.count.yellow {
  color: #E6A23C;
}

.count.orange {
  color: #F56C6C;
}

.count-label {
  color: #666;
}

.alert-settings {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.alert-item {
  display: flex;
  align-items: center;
  margin-left: 30px;
}

.alert-item span {
  margin: 0 10px;
  color: #666;
}

/* Storage overview styles */
.storage-overview {
  margin-bottom: 30px;
}

.storage-cards {
  display: flex;
  justify-content: space-between;
}

.storage-card {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  margin: 0 10px;
}

.storage-card:first-child {
  margin-left: 0;
}

.storage-card:last-child {
  margin-right: 0;
}

.storage-card h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: normal;
}

.storage-size {
  font-size: 42px;
  color: #333;
  line-height: 1.2;
}

.storage-size span {
  font-size: 18px;
  margin-left: 5px;
}

.storage-desc {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

/* Balance card styles */
.balance-card {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-amount {
  display: flex;
}

.balance {
  font-size: 42px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 30px;
  line-height: 1;
  position: relative;
}

.currency {
  font-size: 20px;
  vertical-align: super;
}

.balance-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  text-align: center;
}

.voucher-info {
  display: flex;
  align-items: center;
}

.voucher-info div {
  margin-right: 15px;
  color: #666;
}

/* FAQ section styles */
.faq-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.faq-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.faq-section p {
  color: #666;
  margin-bottom: 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  margin-bottom: 10px;
  color: #409EFF;
  cursor: pointer;
}

.faq-link {
  color: #409EFF;
  cursor: pointer;
  margin-top: 10px;
}

/* Examples page styles */
.examples-note {
  background-color: #fdf6ec;
  padding: 10px 15px;
  border-radius: 4px;
  color: #e6a23c;
  margin-bottom: 20px;
}

.examples-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-box {
  width: 300px;
}

.empty-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.pagination span {
  margin-right: 15px;
  color: #666;
}

/* Security page styles */
.security-card {
  margin-top: 20px;
}

.security-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.security-item:last-child {
  border-bottom: none;
}

.item-title {
  width: 100px;
  font-weight: bold;
  color: #333;
}

.item-desc {
  flex: 1;
  color: #666;
  padding: 0 20px;
}

.item-status {
  width: 150px;
  text-align: right;
}

.item-status .el-button {
  margin-top: 10px;
}

/* Storage page styles */
.storage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.storage-info p {
  margin: 0;
  color: #666;
}

.storage-actions {
  margin-bottom: 20px;
}

/* Voucher page styles */
.voucher-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.voucher-balance {
  font-size: 16px;
  color: #666;
}

.voucher-balance .amount {
  color: #409EFF;
  font-weight: bold;
}

/* Transaction page styles */
.transaction-filter {
  margin-bottom: 20px;
}

/* Banner uploader styles */
.banner-uploader {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.banner-uploader:hover {
  border-color: #409EFF;
}

.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.banner-image {
  width: 100%;
  height: 178px;
  display: block;
  object-fit: cover;
}

.banner-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .dashboard-menu {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .storage-cards {
    flex-direction: column;
  }
  
  .storage-card {
    margin: 0 0 15px 0;
  }
  
  .balance-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .voucher-info {
    margin-top: 20px;
  }
  
  .security-item {
    flex-direction: column;
  }
  
  .item-desc, .item-status {
    padding: 10px 0 0 0;
    width: 100%;
  }
}
</style>