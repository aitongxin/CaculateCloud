<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册账号</h2>
      <div class="tabs">
        <div :class="['tab', { active: activeTab === 'mobile' }]" @click="activeTab = 'mobile'">
          手机号注册
        </div>
      </div>

      <!-- 手机号注册表单 -->
      <div class="register-form">
        <el-form :model="registerForm" ref="registerFormRef" :rules="registerRules" label-width="0">
          <el-form-item prop="mobile">
            <div class="mobile-input">
              <div class="prefix">+86</div>
              <el-input v-model="registerForm.mobile" placeholder="请输入" />
            </div>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <div class="verify-code-input">
              <el-input v-model="registerForm.verifyCode" placeholder="验证码" />
              <el-button type="primary" :disabled="countdown > 0" @click="sendVerifyCode">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="账号名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="密码" show-password />
          </el-form-item>
          <div class="agreement">
            <el-checkbox v-model="agreement">我已阅读并同意</el-checkbox>
            <span class="agreement-link">用户协议</span>、
            <span class="agreement-link">隐私政策</span>、
            <span class="agreement-link">产品服务协议</span>
          </div>
          <el-button type="primary" class="register-btn" :disabled="!agreement" :loading="loading" @click="handleRegister">
            立即注册
          </el-button>
        </el-form>
      </div>

      <!-- 跳转登录 -->
      <div class="login-link">
        <span @click="$router.push('/login')">前往登录 &gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 导入模拟数据库功能
import {
  mockUsers,
  mockPhoneCodes,
  addUser,
  verifyCode,
  generateVerifyCode,
  setVerifyCode
} from '../utils/mockDb';

const router = useRouter();
const activeTab = ref('mobile');
const countdown = ref(0);
const registerFormRef = ref(null);
const agreement = ref(false);
const loading = ref(false);

// 注册表单
const registerForm = reactive({
  mobile: '',
  verifyCode: '',
  username: '',
  password: ''
});

// 表单验证规则
const registerRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入账号名', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在3到20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
};

// 注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  if (!agreement.value) {
    ElMessage.warning('请阅读并同意用户协议');
    return;
  }
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        // 验证手机号和验证码是否匹配
        const isCodeValid = verifyCode(registerForm.mobile, registerForm.verifyCode);
        if (!isCodeValid) {
          ElMessage.error('验证码错误或已过期');
          loading.value = false;
          return;
        }

        // 检查用户名是否已存在
        const userExists = mockUsers.some(user => user.username === registerForm.username);
        if (userExists) {
          ElMessage.error('该用户名已被注册');
          loading.value = false;
          return;
        }

        // 模拟注册过程
        setTimeout(() => {
          // 创建新用户
          const newUser = {
            username: registerForm.username,
            password: registerForm.password,
            mobile: registerForm.mobile,
            role: 'user',
            id: `user_${Date.now()}`
          };
          
          // 将新用户添加到模拟数据库
          const result = addUser(newUser);
          
          if (result.success) {
            // 登录新用户
            localStorage.setItem('token', `mock-token-${Date.now()}`);
            localStorage.setItem('user', JSON.stringify({
              username: newUser.username,
              id: newUser.id,
              role: newUser.role
            }));
            
            ElMessage.success('注册成功');
            router.push('/dashboard');
          } else {
            ElMessage.error(result.message || '注册失败');
          }
          
          loading.value = false;
        }, 1000);
      } catch (error) {
        console.error('注册失败:', error);
        ElMessage.error('注册失败，请稍后再试');
        loading.value = false;
      }
    }
  });
};

// 发送验证码
const sendVerifyCode = async () => {
  if (!registerForm.mobile) {
    ElMessage.warning('请输入手机号');
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.mobile)) {
    ElMessage.warning('请输入有效的手机号');
    return;
  }

  try {
    // 生成6位随机验证码
    const verifyCode = generateVerifyCode();
    console.log(`手机号 ${registerForm.mobile} 的验证码: ${verifyCode}`);
    
    // 将验证码保存到模拟数据库
    setVerifyCode(registerForm.mobile, verifyCode);
    
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
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f7f9fc;
}

.register-box {
  width: 400px;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 100%;
  margin-top: 20px;
  height: 44px;
  font-size: 16px;
}

.login-link {
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

.agreement {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.agreement-link {
  color: #409EFF;
  cursor: pointer;
}
</style> 