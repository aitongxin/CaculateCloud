<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 登录选项卡 -->
      <div class="tabs">
        <div :class="['tab', { active: activeTab === 'account' }]" @click="activeTab = 'account'">
          账密登录
        </div>
        <div :class="['tab', { active: activeTab === 'mobile' }]" @click="activeTab = 'mobile'">
          手机号登录
        </div>
      </div>

      <!-- 账号密码登录表单 -->
      <div v-if="activeTab === 'account'" class="login-form">
        <el-form :model="accountForm" ref="accountFormRef" :rules="accountRules">
          <el-form-item prop="username">
            <el-input v-model="accountForm.username" placeholder="账号名" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="accountForm.password" 
              type="password" 
              placeholder="密码" 
              prefix-icon="Lock" 
              show-password 
            />
          </el-form-item>
          <div class="forgot-password">
            <span @click="forgotPassword">忘记密码 &gt;</span>
          </div>
          <el-button type="primary" class="login-btn" @click="handleAccountLogin" :loading="loading">
            立即登录
          </el-button>
        </el-form>
      </div>

      <!-- 手机号登录表单 -->
      <div v-else class="login-form">
        <el-form :model="mobileForm" ref="mobileFormRef" :rules="mobileRules">
          <el-form-item prop="mobile">
            <div class="mobile-input">
              <div class="prefix">+86</div>
              <el-input v-model="mobileForm.mobile" placeholder="请输入" />
            </div>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <div class="verify-code-input">
              <el-input v-model="mobileForm.verifyCode" placeholder="验证码" />
              <el-button type="primary" :disabled="countdown > 0" @click="sendVerifyCode">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-button type="primary" class="login-btn" @click="handleMobileLogin" :loading="loading">
            立即登录
          </el-button>
        </el-form>
      </div>

      <!-- 跳转注册 -->
      <div class="register-link">
        <span @click="$router.push('/register')">前往注册 &gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import axios from 'axios';

// 导入模拟数据库
import {
  mockUsers,
  mockPhoneCodes,
  verifyUser,
  verifyCode,
  generateVerifyCode,
  setVerifyCode
} from '../utils/mockDb';

const router = useRouter();
const route = useRoute();
const activeTab = ref('account');
const countdown = ref(0);
const accountFormRef = ref(null);
const mobileFormRef = ref(null);
const loading = ref(false); // 添加loading状态

// 账号密码登录表单
const accountForm = reactive({
  username: '',
  password: ''
});

// 手机号登录表单
const mobileForm = reactive({
  mobile: '',
  verifyCode: ''
});

// 表单验证规则
const accountRules = {
  username: [
    { required: true, message: '请输入账号名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
};

const mobileRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
};

// 账号密码登录
const handleAccountLogin = async () => {
  if (!accountFormRef.value) return;
  
  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        // 验证用户名和密码
        const user = verifyUser(accountForm.username, accountForm.password);
        
        if (user) {
          // 登录成功
          setTimeout(() => {
            // 存储token和用户信息
            localStorage.setItem('token', `mock-token-${Date.now()}`);
            localStorage.setItem('user', JSON.stringify({
              username: user.username,
              id: user.id,
              role: user.role
            }));
            
            ElMessage.success('登录成功');
            
            // 检查是否有重定向信息，如果有则重定向到指定页面，否则去控制台
            const redirectPath = route.query.redirect || '/dashboard';
            router.push(redirectPath);
            loading.value = false;
          }, 1000);
        } else {
          // 登录失败
          setTimeout(() => {
            ElMessage.error('账号或密码错误');
            loading.value = false;
          }, 1000);
        }
      } catch (error) {
        console.error('登录失败:', error);
        ElMessage.error('登录失败，请检查账号和密码');
        loading.value = false;
      }
    }
  });
};

// 手机号登录
const handleMobileLogin = async () => {
  if (!mobileFormRef.value) return;
  
  await mobileFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        // 验证手机号和验证码
        const isCodeValid = verifyCode(mobileForm.mobile, mobileForm.verifyCode);
        
        if (isCodeValid) {
          // 查找是否有对应手机号的用户
          const existingUser = mockUsers.find(user => user.mobile === mobileForm.mobile);
          
          // 登录成功
          setTimeout(() => {
            // 存储token和用户信息
            localStorage.setItem('token', `mock-token-${Date.now()}`);
            
            // 如果是已注册用户，使用已有信息，否则创建临时用户信息
            if (existingUser) {
              localStorage.setItem('user', JSON.stringify({
                username: existingUser.username,
                id: existingUser.id,
                role: existingUser.role
              }));
            } else {
              localStorage.setItem('user', JSON.stringify({
                username: `user_${mobileForm.mobile}`,
                id: `mobile_${Date.now()}`,
                role: 'user'
              }));
            }
            
            ElMessage.success('登录成功');
            
            // 检查是否有重定向信息，如果有则重定向到指定页面，否则去控制台
            const redirectPath = route.query.redirect || '/dashboard';
            router.push(redirectPath);
            loading.value = false;
          }, 1000);
        } else {
          // 验证码错误
          setTimeout(() => {
            ElMessage.error('验证码错误或已过期');
            loading.value = false;
          }, 1000);
        }
      } catch (error) {
        console.error('登录失败:', error);
        ElMessage.error('登录失败，请检查手机号和验证码');
        loading.value = false;
      }
    }
  });
};

// 发送验证码
const sendVerifyCode = async () => {
  if (!mobileForm.mobile) {
    ElMessage.warning('请输入手机号');
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(mobileForm.mobile)) {
    ElMessage.warning('请输入有效的手机号');
    return;
  }

  try {
    // 生成6位随机验证码
    const verifyCode = generateVerifyCode();
    console.log(`手机号 ${mobileForm.mobile} 的验证码: ${verifyCode}`);
    
    // 将验证码保存到模拟数据库
    setVerifyCode(mobileForm.mobile, verifyCode);
    
    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    ElMessage.success(`验证码已发送: ${verifyCode}`);
  } catch (error) {
    console.error('发送验证码失败:', error);
    ElMessage.error('发送验证码失败');
  }
};

// 忘记密码
const forgotPassword = () => {
  ElMessage.info('请联系管理员重置密码');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f7f9fc;
}

.login-box {
  width: 400px;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  cursor: pointer;
  font-size: 16px;
}

.tab.active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
  font-weight: bold;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
  height: 44px;
  font-size: 16px;
}

.forgot-password {
  text-align: right;
  margin-top: 10px;
  cursor: pointer;
  color: #999;
}

.forgot-password:hover {
  color: #409EFF;
}

.register-link {
  margin-top: 20px;
  text-align: right;
  cursor: pointer;
  color: #409EFF;
}

.mobile-input {
  display: flex;
  align-items: center;
}

.prefix {
  width: 60px;
  height: 40px;
  background-color: #f7f7f7;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-input .el-input :deep(input) {
  border-radius: 0 4px 4px 0;
}

.verify-code-input {
  display: flex;
}

.verify-code-input .el-input {
  flex: 1;
  margin-right: 10px;
}

.verify-code-input .el-button {
  width: 120px;
}
</style> 