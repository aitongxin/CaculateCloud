<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 侧边菜单 -->
      <div class="admin-menu">
        <h3 class="menu-title">后台管理系统</h3>
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
      <div class="admin-content">
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
        
        <!-- 商家管理 -->
        <div v-if="activeMenu === 'merchant'" class="content-section">
          <div class="section-header">
            <h2>商家管理</h2>
          </div>
          
          <el-table :data="merchants" style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="contact" label="联系方式" />
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.isVerified ? 'success' : 'warning'">
                  {{ scope.row.isVerified ? '已审核' : '待审核' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button v-if="!scope.row.isVerified" size="small" type="success" @click="verifyMerchant(scope.row)">审核通过</el-button>
                <el-button size="small" type="danger" @click="deleteMerchant(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 用户管理 -->
        <div v-if="activeMenu === 'user'" class="content-section">
          <div class="section-header">
            <h2>用户管理</h2>
          </div>
          
          <el-table :data="users" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="role" label="角色">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'admin' ? 'danger' : scope.row.role === 'merchant' ? 'success' : 'info'">
                  {{ scope.row.role === 'admin' ? '管理员' : scope.row.role === 'merchant' ? '商家' : '用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" type="primary" @click="editUser(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 常见问题管理 -->
        <div v-if="activeMenu === 'faq'" class="content-section">
          <div class="section-header">
            <h2>常见问题管理</h2>
            <el-button type="primary" @click="showAddFAQ">
              <el-icon><plus /></el-icon> 添加问题
            </el-button>
          </div>
          
          <el-table :data="faqs" style="width: 100%">
            <el-table-column prop="question" label="问题" />
            <el-table-column prop="answer" label="回答" :show-overflow-tooltip="true" />
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch v-model="scope.row.active" @change="updateFAQStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button size="small" @click="editFAQ(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteFAQ(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
    
    <!-- FAQ表单对话框 -->
    <el-dialog v-model="showFAQForm" title="常见问题管理" width="600px">
      <el-form :model="faqForm" ref="faqFormRef" label-width="80px" :rules="faqRules">
        <el-form-item label="问题" prop="question">
          <el-input v-model="faqForm.question" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="回答" prop="answer">
          <el-input v-model="faqForm.answer" type="textarea" rows="4" placeholder="请输入回答" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="faqForm.order" :min="0" :max="99" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="active">
          <el-switch
            v-model="faqForm.active"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFAQForm = false">取消</el-button>
          <el-button type="primary" @click="saveFAQ" :loading="submitting">保存</el-button>
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
  Setting, Document, ChatLineRound, Upload, QuestionFilled
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import { mockUsers } from '../utils/mockDb';
import { banners as bannersData, computingResources as computingResourcesData, merchants as merchantsData, faqs as faqsData } from '../utils/commonData';

// 获取用户信息和检查权限
const router = useRouter();
const userRole = ref('');

onMounted(() => {
  // 检查用户是否为管理员
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userRole.value = user.role;
      
      // 如果不是管理员，重定向到首页
      if (user.role !== 'admin') {
        ElMessage.error('您没有权限访问管理系统');
        router.push('/');
      }
    } catch (error) {
      console.error('解析用户信息失败:', error);
      router.push('/login');
    }
  } else {
    ElMessage.error('请先登录');
    router.push('/login');
  }
});

// 菜单状态
const activeMenu = ref('banner');
const menuItems = [
  { key: 'banner', label: 'Banner管理', icon: 'Picture' },
  { key: 'computing', label: '算力资源管理', icon: 'DataLine' },
  { key: 'merchant', label: '商家管理', icon: 'ShoppingCart' },
  { key: 'user', label: '用户管理', icon: 'User' },
  { key: 'faq', label: '常见问题管理', icon: 'QuestionFilled' },
];

// 表单显示控制
const showBannerForm = ref(false);
const showComputingForm = ref(false);
const showFAQForm = ref(false);
const submitting = ref(false);

// Banner数据
const banners = ref([...bannersData]);

// 算力资源数据
const computingResources = ref([...computingResourcesData]);

// 商家数据
const merchants = ref([...merchantsData]);

// 用户数据
const users = ref([...mockUsers.map(user => ({
  ...user,
  createdAt: '2023-06-15 10:00:00'
}))]);

// 常见问题数据
const faqs = ref([...faqsData]);

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

// FAQ表单
const faqFormRef = ref(null);
const faqForm = reactive({
  id: null,
  question: '',
  answer: '',
  order: 0,
  active: true
});

// FAQ表单验证规则
const faqRules = {
  question: [
    { required: true, message: '请输入问题', trigger: 'blur' },
    { max: 100, message: '问题长度不能超过100个字符', trigger: 'blur' }
  ],
  answer: [
    { required: true, message: '请输入回答', trigger: 'blur' },
  ],
  order: [
    { required: true, message: '请输入排序', trigger: 'blur' }
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

// 用户相关操作
const editUser = (user) => {
  ElMessage.info('用户编辑功能待实现');
};

const deleteUser = (user) => {
  if (user.role === 'admin') {
    ElMessage.error('不能删除管理员用户');
    return;
  }
  
  ElMessageBox.confirm('确定要删除这个用户吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(item => item.id !== user.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// FAQ相关操作
const showAddFAQ = () => {
  // 重置表单
  Object.keys(faqForm).forEach(key => {
    if (key !== 'active') {
      faqForm[key] = key === 'id' ? null : key === 'order' ? 0 : '';
    }
  });
  showFAQForm.value = true;
};

const editFAQ = (faq) => {
  Object.assign(faqForm, faq);
  showFAQForm.value = true;
};

const saveFAQ = async () => {
  if (!faqFormRef.value) return;
  
  await faqFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      
      try {
        // 模拟保存逻辑
        setTimeout(() => {
          if (faqForm.id) {
            // 更新现有FAQ
            const index = faqs.value.findIndex(item => item.id === faqForm.id);
            if (index !== -1) {
              faqs.value[index] = { ...faqForm };
            }
            ElMessage.success('常见问题更新成功');
          } else {
            // 添加新FAQ
            const newFAQ = { ...faqForm, id: Date.now() };
            faqs.value.push(newFAQ);
            ElMessage.success('常见问题添加成功');
          }
          
          showFAQForm.value = false;
          submitting.value = false;
        }, 1000);
      } catch (error) {
        console.error('保存常见问题失败:', error);
        ElMessage.error('保存失败，请稍后再试');
        submitting.value = false;
      }
    }
  });
};

const deleteFAQ = (faq) => {
  ElMessageBox.confirm('确定要删除这个常见问题吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    faqs.value = faqs.value.filter(item => item.id !== faq.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

const updateFAQStatus = (faq) => {
  ElMessage.success(`常见问题 "${faq.question}" ${faq.active ? '已启用' : '已禁用'}`);
};
</script>

<style scoped>
.admin-page {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.admin-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-menu {
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

.admin-content {
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

/* 上传图片样式 */
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

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-menu {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style> 