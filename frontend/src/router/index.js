import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/merchant/:id',
    name: 'MerchantDetail',
    component: () => import('../views/MerchantDetail.vue')
  },
  {
    path: '/computing',
    name: 'Computing',
    component: () => import('../views/Computing.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // 检查该路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果需要认证且没有token，重定向到登录页
    if (!token) {
      next({ 
        name: 'Login',
        query: { redirect: to.fullPath } // 添加重定向参数，登录后回到原页面
      });
    } else {
      // 检查是否需要管理员权限
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        // 获取用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            // 如果不是管理员，重定向到首页
            if (user.role !== 'admin') {
              next({ name: 'Home' });
              return;
            }
          } catch (error) {
            console.error('解析用户数据失败:', error);
            next({ name: 'Login' });
            return;
          }
        } else {
          next({ name: 'Login' });
          return;
        }
      }
      
      // 有token但可能过期，这里可以添加token有效性验证
      // 在实际项目中应该验证token是否有效
      next();
    }
  } else if (to.path === '/login' && token) {
    // 如果用户已登录但试图访问登录页，重定向到首页
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router; 