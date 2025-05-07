<template>
  <div class="home">
    <!-- Banner轮播区域 -->
    <div class="banner-section">
      <el-carousel height="500px" indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-slide" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
              <el-button v-if="banner.targetUrl" type="primary" class="banner-btn">了解更多</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 内容区域：商家/用户Banner -->
    <div class="content-section">
      <h2 class="section-title">算力云解决方案</h2>
      
      <!-- 商家Banner -->
      <div class="feature-banner merchant-banner">
        <div class="banner-text">
          <h2>欢迎商家入驻算力平台乐园</h2>
          <p>成为我们的合作伙伴，共同打造高性能算力服务生态</p>
          <p>快速接入、灵活配置、高效管理</p>
        </div>
        <el-button type="primary" size="large" class="feature-btn" @click="$router.push('/merchant/apply')">申请入驻</el-button>
      </div>

      <!-- 用户Banner -->
      <div class="feature-banner user-banner">
        <div class="banner-text">
          <h2>低成本高效能计算资源</h2>
          <p>无需购买硬件，按需租借计算资源</p>
          <p>AI模型训练、大数据分析、科学计算一站式解决</p>
        </div>
        <el-button type="primary" size="large" class="feature-btn" @click="$router.push('/computing')">浏览算力</el-button>
      </div>

      <!-- 优势展示 -->
      <div class="advantages">
        <h2 class="section-title">我们的优势</h2>
        <div class="advantage-items">
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-lightning /></el-icon>
            </div>
            <h3>高性能</h3>
            <p>顶级GPU集群，提供最强算力支持</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-money /></el-icon>
            </div>
            <h3>低成本</h3>
            <p>按需付费，无需前期硬件投入</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-connection /></el-icon>
            </div>
            <h3>灵活配置</h3>
            <p>多种算力规格，满足不同业务需求</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon><i-ep-service /></el-icon>
            </div>
            <h3>专业支持</h3>
            <p>7×24技术服务，保障业务无忧运行</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Lightning, Money, Connection, Service } from '@element-plus/icons-vue';

// Banner数据
const banners = ref([
  {
    title: '算力云平台',
    subtitle: '高效灵活的计算资源租用服务',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1920&auto=format&fit=crop',
    targetUrl: '/computing'
  },
  {
    title: '专业GPU计算资源',
    subtitle: '支持AI训练、渲染、科学计算等多种场景',
    imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1920&auto=format&fit=crop',
    targetUrl: '/computing'
  },
  {
    title: '高效能低成本',
    subtitle: '按需租用，无需购买硬件',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop',
    targetUrl: '/merchant/apply'
  },
]);

// 生命周期钩子
onMounted(async () => {
  try {
    // 在实际开发中，从API获取Banner数据
    // const response = await axios.get('http://localhost:5000/api/banner');
    // banners.value = response.data;
  } catch (error) {
    console.error('获取Banner失败:', error);
  }
});
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-section {
  width: 100%;
  margin-bottom: 40px;
  padding-top: 64px;
}

.banner-slide {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.banner-content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 30px 50px;
  border-radius: 8px;
  max-width: 600px;
}

.banner-content h2 {
  margin: 0 0 15px 0;
  font-size: 38px;
  font-weight: 600;
}

.banner-content p {
  margin: 0 0 20px 0;
  font-size: 18px;
  opacity: 0.9;
}

.banner-btn {
  padding: 12px 24px;
  font-size: 16px;
}

.content-section {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px 50px;
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

.feature-banner {
  margin: 40px 0;
  padding: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 200px;
  color: white;
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-banner:hover {
  transform: translateY(-5px);
}

.merchant-banner {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop');
}

.user-banner {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1200&auto=format&fit=crop');
}

.banner-text {
  flex: 1;
  padding-right: 40px;
}

.banner-text h2 {
  margin: 0 0 15px 0;
  font-size: 28px;
  font-weight: 600;
}

.banner-text p {
  margin: 0 0 10px 0;
  font-size: 16px;
  opacity: 0.9;
}

.feature-btn {
  padding: 12px 24px;
  font-size: 16px;
}

/* 优势部分 */
.advantages {
  margin: 60px 0;
}

.advantage-items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.advantage-item {
  flex: 1;
  min-width: 250px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-icon {
  margin-bottom: 20px;
  font-size: 36px;
  color: #409EFF;
  display: flex;
  justify-content: center;
}

.advantage-item h3 {
  margin: 0 0 15px 0;
  font-size: 22px;
  color: #333;
}

.advantage-item p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .banner-content {
    padding: 20px 30px;
  }
  
  .banner-content h2 {
    font-size: 28px;
  }
  
  .feature-banner {
    flex-direction: column;
    text-align: center;
    padding: 30px;
  }
  
  .banner-text {
    padding-right: 0;
    margin-bottom: 20px;
  }
  
  .advantage-items {
    flex-direction: column;
  }
}
</style> 