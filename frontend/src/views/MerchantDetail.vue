<template>
  <div class="merchant-detail-page">
    <div class="merchant-hero">
      <div class="hero-content">
        <h1>为什么加入<span>算力云</span>合作</h1>
        <p>成为算力云平台的合作伙伴，共同打造高性能算力服务生态</p>
      </div>
    </div>
    
    <div class="page-container">
      <!-- 合作优势 -->
      <div class="advantages-section">
        <h2 class="section-title">合作优势</h2>
        <div class="advantages-grid">
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-data-line /></el-icon>
            </div>
            <h3>高效变现</h3>
            <p>空闲设备资源轻松实现价值最大化</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-management /></el-icon>
            </div>
            <h3>平台管理</h3>
            <p>全方位管理工具，轻松监控资源使用</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-money /></el-icon>
            </div>
            <h3>收益保障</h3>
            <p>稳定的结算周期，透明的收益分成</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-promotion /></el-icon>
            </div>
            <h3>营销推广</h3>
            <p>专业团队提供市场营销支持</p>
          </div>
        </div>
      </div>
      
      <!-- 合作类型标签 -->
      <div class="cooperation-section">
        <h2 class="section-title">申请入驻</h2>
        <div class="cooperation-tabs">
          <div 
            v-for="(tab, index) in cooperationTabs" 
            :key="index" 
            :class="['tab', { active: activeTab === tab.value }]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
        
        <!-- 合作表单 -->
        <div class="form-container">
          <el-form 
            :model="merchantForm" 
            ref="merchantFormRef" 
            label-width="100px" 
            :rules="formRules"
            class="merchant-form"
          >
            <el-form-item label="称呼" prop="customerName">
              <el-input v-model="merchantForm.customerName" placeholder="请输入您的姓名" />
            </el-form-item>
            
            <el-form-item v-if="activeTab === 'enterprise'" label="企业名称" prop="companyName">
              <el-input v-model="merchantForm.companyName" placeholder="请输入企业名称" />
            </el-form-item>
            
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="merchantForm.contact" placeholder="请输入手机号码或邮箱" />
            </el-form-item>
            
            <el-form-item label="设备描述" prop="deviceDescription">
              <el-input 
                v-model="merchantForm.deviceDescription" 
                type="textarea" 
                rows="5" 
                placeholder="请描述您的设备型号、数量、规格等信息"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" class="submit-btn" @click="submitForm">提交申请</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <!-- 流程说明 -->
      <div class="process-section">
        <h2 class="section-title">合作流程</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>提交申请</h3>
            <p>填写资料并提交申请</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>资质审核</h3>
            <p>平台审核您的设备资质</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>签订协议</h3>
            <p>双方确认合作细则</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>设备接入</h3>
            <p>接入设备并开始提供服务</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { DataLine, Management, Money, Promotion } from '@element-plus/icons-vue';
import axios from 'axios';

const router = useRouter();
const merchantFormRef = ref(null);
const activeTab = ref('personal');

// 合作类型标签
const cooperationTabs = [
  { label: '个人合作', value: 'personal' },
  { label: '企业合作', value: 'enterprise' }
];

// 商家表单
const merchantForm = reactive({
  name: '',
  companyName: '',
  contact: '',
  description: '',
  type: 'personal'
});
  
// 表单验证规则（字段名与 merchantForm 一致）
const formRules = {
  customerName: [ // ✅ 原 name 改为 customerName
    { required: true, message: '请输入称呼', trigger: 'blur' }
  ],
  companyName: [
    {
      required: (rule, value, callback) => {
        if (activeTab.value === 'enterprise' && !value) {
          callback(new Error('请输入企业名称'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ],
  deviceDescription: [ // ✅ 原 description 改为 deviceDescription
    { required: true, message: '请输入设备描述', trigger: 'blur' }
  ]
};

// 监听标签变化，更新表单类型
const updateFormType = () => {
  merchantForm.type = activeTab.value;
};

// 提交表单
const submitForm = async () => {
    const isLoading = ref(false);
    const merchantFormRefValue = merchantFormRef.value;

    if (!merchantFormRefValue) return;

    try {
        isLoading.value = true;
        const isValid = await merchantFormRefValue.validate();
        if (!isValid) return;

        // 构建请求数据
        const formData = {
            customerName: merchantForm.customerName.trim(),
            companyName: merchantForm.companyName.trim(),
            contact: merchantForm.contact.trim(),
            deviceDescription: merchantForm.deviceDescription.trim(),
            applyType: activeTab.value
        };

        // 发起网络请求，不携带 Authorization 头部
        const response = await axios.post(
            'http://localhost:5000/api/customers',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        if (response.status === 201) {
            ElMessage.success('提交成功');
            merchantFormRefValue.resetFields();
            activeTab.value = 'personal';
        }
    } catch (error) {
        if (error.response) {
            ElMessage.error(error.response.data.message || '请求失败');
        } else {
            ElMessage.error('网络连接失败，请检查网络设置');
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.merchant-detail-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f9fc;
}

.merchant-hero {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  margin-bottom: 40px;
  padding-top: 64px;
}

.merchant-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1480506132288-68f7705954bd?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

.hero-content {
  z-index: 1;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 42px;
  margin-bottom: 15px;
  font-weight: 600;
}

.hero-content h1 span {
  color: #ffd04b;
}

.hero-content p {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
}

.page-container {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px 60px;
}

.section-title {
  text-align: center;
  margin: 40px 0;
  font-size: 32px;
  color: #333;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: #409EFF;
}

/* 优势部分 */
.advantages-section {
  margin-bottom: 60px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.advantage-item {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-icon {
  margin-bottom: 20px;
  font-size: 40px;
  color: #409EFF;
  display: flex;
  justify-content: center;
}

.advantage-item h3 {
  margin: 0 0 10px 0;
  font-size: 22px;
  color: #333;
}

.advantage-item p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* 合作申请部分 */
.cooperation-section {
  margin-bottom: 60px;
}

.cooperation-tabs {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
  position: relative;
  font-size: 16px;
  transition: all 0.3s;
}

.tab.active {
  color: #409EFF;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
}

.form-container {
  display: flex;
  justify-content: center;
}

.merchant-form {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  margin-top: 20px;
}

/* 流程部分 */
.process-section {
  margin-bottom: 40px;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 50px;
}

.process-step {
  flex: 1;
  min-width: 200px;
  position: relative;
  text-align: center;
  padding: 0 15px;
}

.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 25px;
  right: -10%;
  width: 70%;
  height: 2px;
  background-color: #e0e0e0;
}

.step-number {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin: 0 auto 20px;
  position: relative;
  z-index: 2;
}

.process-step h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.process-step p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .process-steps {
    flex-direction: column;
    align-items: center;
  }
  
  .process-step {
    width: 100%;
    margin-bottom: 30px;
  }
  
  .process-step:not(:last-child)::after {
    display: none;
  }
  
  .merchant-form {
    padding: 20px;
  }
}
</style>