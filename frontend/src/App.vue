<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Service, Headset, ArrowDown, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const customerServiceVisible = ref(false)
const userMenuVisible = ref(false)

// 用户信息
const userInfo = ref({
  username: 'jjjj123123',
  avatar: null,
  isVerified: false,
  instanceCount: 1,
  voucherCount: 2,
  balance: 0,
  role: 'user' // 添加用户角色
})

// 根据是否有token判断用户是否登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

// 检查用户是否是管理员
const isAdmin = computed(() => {
  return userInfo.value.role === 'admin';
});

// 显示客服弹窗
const showCustomerService = () => {
  customerServiceVisible.value = true
}

// 显示或隐藏用户菜单
const toggleUserMenu = () => {
  userMenuVisible.value = !userMenuVisible.value
}

// 关闭用户菜单
const closeUserMenu = () => {
  userMenuVisible.value = false
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  userMenuVisible.value = false
  // 强制重定向到首页并刷新页面，确保完全退出登录状态
  router.push('/')
  // 给路由跳转一点时间后再刷新页面
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

// 获取用户信息（模拟）
const getUserInfo = () => {
  // 在实际项目中，应该从后端API获取用户信息
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData)
      userInfo.value = {
        ...userInfo.value,
        ...parsedUser
      }
    } catch (e) {
      console.error('解析用户数据失败', e)
    }
  }
}

// 为测试创建一个登录函数
const mockLogin = () => {
  localStorage.setItem('token', 'mock-token-1234567890')
  localStorage.setItem('user', JSON.stringify({
    username: 'jjjj123123',
    id: 'xaxaxaxax123'
  }))
  getUserInfo()
  router.push('/dashboard')
}

// 处理控制台点击
const handleConsoleClick = () => {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    ElMessage.warning('请先登录')
    router.push('/login?redirect=/dashboard')
  }
}

// 进入管理后台
const goToAdmin = () => {
  router.push('/admin');
};

onMounted(() => {
  if (isLoggedIn.value) {
    getUserInfo()
  }
})
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="header">
    <div class="logo-container" @click="$router.push('/')">
      <div class="logo">LOGO</div>
    </div>
    <div class="nav-links">
      <!-- 将控制台按钮设为常驻，移除v-if条件 -->
      <div class="nav-item" @click="handleConsoleClick">
        <el-icon><service /></el-icon>
        <span>控制台</span>
      </div>
      <div class="nav-item" @click="showCustomerService">
        <el-icon><headset /></el-icon>
        <span>客服</span>
      </div>
      
      <!-- 登录前显示注册/登录按钮 -->
      <template v-if="!isLoggedIn">
        <div class="nav-item" @click="$router.push('/register')">
          <span>注册</span>
        </div>
        <div class="nav-item login-btn" @click="$router.push('/login')">
          <span>登录</span>
        </div>
      </template>
      
      <!-- 登录后显示用户头像和下拉菜单 -->
      <div v-else class="user-dropdown" v-click-outside="closeUserMenu">
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像">
            <div v-else class="default-avatar">{{ userInfo.username.charAt(0).toUpperCase() }}</div>
          </div>
          <span class="username">{{ userInfo.username }}</span>
          <el-icon class="dropdown-icon"><arrow-down /></el-icon>
        </div>
        
        <!-- 用户菜单 -->
        <div v-show="userMenuVisible" class="user-menu">
          <div class="user-menu-header">
            <div class="user-menu-avatar">
              <div class="default-avatar large">{{ userInfo.username.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="user-menu-info">
              <div class="user-menu-name">{{ userInfo.username }}</div>
              <div class="user-status">
                <span v-if="userInfo.isVerified" class="verified">已实名</span>
                <span v-else class="unverified">未实名</span>
              </div>
            </div>
          </div>
          <div class="user-menu-id">ID :{{ userInfo.id || 'xaxaxaxax123' }} <el-icon><document /></el-icon></div>
          <div class="user-menu-stats">
            <div class="stat-item">
              <div class="stat-label">客户实例:</div>
              <div class="stat-value">{{ userInfo.instanceCount || 1 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">代金券:</div>
              <div class="stat-value">{{ userInfo.voucherCount || 2 }}张</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">余额:</div>
              <div class="stat-value">{{ userInfo.balance || 0 }}元</div>
            </div>
          </div>
          <!-- 管理员可见的后台入口 -->
          <div v-if="isAdmin" class="user-menu-action admin" @click="goToAdmin">
            进入管理后台
          </div>
          <div class="user-menu-action" @click="logout">
            退出登录
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 路由视图 -->
  <div class="main-content">
    <router-view />
  </div>

  <!-- 客服弹窗 -->
  <el-dialog v-model="customerServiceVisible" title="客服中心" width="350px">
    <div class="customer-service">
      <p>邮箱: 22222@163.com</p>
      <p>电话: 13651348888</p>
    </div>
  </el-dialog>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.logo-container {
  cursor: pointer;
  z-index: 1001;
}

.logo {
  width: 40px;
  height: 40px;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: bold;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.nav-links {
  display: flex;
  align-items: center;
  z-index: 1001;
}

.nav-item {
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #409EFF;
}

.login-btn, .logout-btn {
  background-color: #409EFF;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.login-btn:hover, .logout-btn:hover {
  background-color: #66b1ff;
  color: white;
}

.logout-btn {
  background-color: #F56C6C;
}

.logout-btn:hover {
  background-color: #f78989;
}

.customer-service {
  text-align: center;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  min-height: calc(100vh - 64px);
}

/* 用户头像和下拉菜单样式 */
.user-dropdown {
  position: relative;
  margin-left: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.default-avatar.large {
  width: 50px;
  height: 50px;
  font-size: 20px;
}

.username {
  font-size: 14px;
  margin-right: 5px;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
}

/* 用户菜单样式 */
.user-menu {
  position: absolute;
  top: 45px;
  right: 0;
  width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.user-menu-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.user-menu-avatar {
  margin-right: 15px;
}

.user-menu-info {
  flex: 1;
}

.user-menu-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-status {
  font-size: 12px;
}

.verified {
  color: #67c23a;
}

.unverified {
  color: #e6a23c;
}

.user-menu-id {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.user-menu-stats {
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 14px;
}

.stat-label {
  color: #606266;
}

.stat-value {
  font-weight: bold;
}

.user-menu-action {
  padding: 15px 0;
  text-align: center;
  color: #f56c6c;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.user-menu-action:hover {
  background-color: #fef0f0;
}

/* 管理后台入口样式 */
.user-menu-action.admin {
  color: #409EFF;
  border-bottom: 1px solid #f0f0f0;
}

.user-menu-action.admin:hover {
  background-color: #ecf5ff;
}
</style>
