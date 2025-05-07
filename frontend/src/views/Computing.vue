<template>
  <div class="computing-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>AI算力资源租用</h1>
        <p>按需租用高性能计算资源，无需购买硬件，即时可用</p>
      </div>
    </div>
    
    <!-- 算力类型标签 -->
    <div class="computing-container">
      <div class="computing-tabs">
        <div 
          v-for="type in computingTypes" 
          :key="type.value" 
          :class="['tab', { active: activeType === type.value }]"
          @click="activeType = type.value"
        >
          {{ type.label }}
        </div>
      </div>

      <!-- 算力资源卡片 -->
      <div class="computing-cards">
        <el-row :gutter="24">
          <el-col 
            v-for="(resource, index) in filteredResources" 
            :key="index" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8"
          >
            <div class="computing-card">
              <div class="card-header">
                <h3>{{ resource.model }}</h3>
              </div>
              <div class="card-content">
                <p class="spec">{{ resource.specs }}</p>
                <div class="price">
                  <span class="amount">¥ {{ resource.price }}</span>
                  <span class="unit">/ {{ resource.unit }}</span>
                </div>
                <el-button type="primary" class="rent-btn" @click="rentComputing(resource)">
                  立即租用
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 服务说明 -->
      <div class="service-info">
        <h2 class="section-title">租用说明</h2>
        <div class="info-grid">
          <div class="info-item">
            <el-icon><i-ep-clock /></el-icon>
            <h3>按需计费</h3>
            <p>精确到小时计费，用多少付多少</p>
          </div>
          <div class="info-item">
            <el-icon><i-ep-cpu /></el-icon>
            <h3>硬件规格</h3>
            <p>提供顶级GPU、CPU资源，满足各类计算需求</p>
          </div>
          <div class="info-item">
            <el-icon><i-ep-operation /></el-icon>
            <h3>简单操作</h3>
            <p>一键启动，自动配置环境</p>
          </div>
          <div class="info-item">
            <el-icon><i-ep-headset /></el-icon>
            <h3>专业支持</h3>
            <p>7×24小时技术支持服务</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Clock, Cpu, Operation, Headset } from '@element-plus/icons-vue';
import axios from 'axios';

const router = useRouter();
const activeType = ref('AI算力');
const computingResources = ref([]);
const loading = ref(true);

// 算力类型
const computingTypes = [
  { label: 'AI算力', value: 'AI算力' },
  { label: '渲染算力', value: '渲染算力' },
  { label: '普通算力', value: '普通算力' }
];

// 模拟数据
const mockResources = [
  {
    model: 'NVIDIA H100 HBM3/80GB',
    specs: '半精 19.7 TFLOPS / 900GB/s（NVLink）',
    price: 8.00,
    unit: '时',
    type: 'AI算力'
  },
  {
    model: 'NVIDIA H100 HBM3/80GB',
    specs: '半精 19.7 TFLOPS / 900GB/s（NVLink）',
    price: 8.00,
    unit: '时',
    type: 'AI算力'
  },
  {
    model: 'NVIDIA H100 HBM3/80GB',
    specs: '半精 19.7 TFLOPS / 900GB/s（NVLink）',
    price: 8.00,
    unit: '时',
    type: 'AI算力'
  },
  {
    model: 'NVIDIA A100',
    specs: '半精 9.7 TFLOPS / 600GB/s（NVLink）',
    price: 5.00,
    unit: '时',
    type: '渲染算力'
  },
  {
    model: 'NVIDIA RTX 4090',
    specs: '24GB VRAM / 1000GB/s',
    price: 3.00,
    unit: '时',
    type: '渲染算力'
  },
  {
    model: 'NVIDIA T4',
    specs: '16GB VRAM / 300GB/s',
    price: 2.00,
    unit: '时',
    type: '普通算力'
  }
];

// 根据选择的类型过滤算力资源
const filteredResources = computed(() => {
  return computingResources.value.filter(resource => resource.type === activeType.value);
});

// 租用算力
const rentComputing = (resource) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    ElMessage.warning('请先登录再租用算力');
    router.push('/login');
    return;
  }
  
  ElMessage.success(`正在为您准备 ${resource.model} 算力资源`);
  // 这里可以跳转到订单页面或展示更多详情
};

// 获取算力资源数据
const fetchComputingResources = async () => {
  try {
    loading.value = true;
    // 在实际项目中，从API获取算力资源数据
    // const response = await axios.get('http://localhost:5000/api/computing');
    // computingResources.value = response.data;
    
    // 使用模拟数据
    computingResources.value = mockResources;
    loading.value = false;
  } catch (error) {
    console.error('获取算力资源失败:', error);
    loading.value = false;
  }
};

onMounted(() => {
  fetchComputingResources();
});
</script>

<style scoped>
.computing-page {
  width: 100%;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  padding-top: 64px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop');
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

.hero-content p {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
}

.computing-container {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px 60px;
}

.computing-tabs {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
}

.computing-tabs .tab {
  padding: 15px 30px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.computing-tabs .tab.active {
  color: #409EFF;
  font-weight: 600;
}

.computing-tabs .tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
}

.computing-cards {
  margin-bottom: 60px;
}

.computing-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.computing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #f7f9fc;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.card-content {
  padding: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
}

.spec {
  color: #666;
  margin-bottom: 20px;
  flex-grow: 1;
}

.price {
  margin: 25px 0;
}

.amount {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
}

.unit {
  color: #999;
  font-size: 14px;
}

.rent-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
}

.section-title {
  text-align: center;
  margin: 20px 0 40px;
  font-size: 28px;
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

.service-info {
  padding: 40px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.info-item {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.info-item:hover {
  transform: translateY(-5px);
}

.info-item .el-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 20px;
}

.info-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.info-item p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .computing-tabs .tab {
    padding: 12px 15px;
    font-size: 14px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style> 