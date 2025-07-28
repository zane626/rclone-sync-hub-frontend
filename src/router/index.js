import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { isLoggedIn } from '../utils/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/folders',
        name: 'Folders',
        component: () => import('../views/folders/list.vue'),
        meta: { title: '文件夹列表' }
      },
      {
        path: '/tasks',
        name: 'Tasks',
        component: () => import('../views/tasks/list.vue'),
        meta: { title: '任务列表' }
      },
      {
        path: '/origin',
        name: 'Origin',
        component: () => import('../views/origin/list.vue'),
        meta: { title: 'origin' }
      }
    ]
  },
  // 404 路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 后台管理系统` : '后台管理系统';

  // 检查是否需要登录权限
  const requiresAuth = !to.matched.some(record => record.meta.public);

  // 如果需要登录权限但用户未登录，则重定向到登录页
  if (requiresAuth && !isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 保存原本要访问的路径，登录成功后可以跳转回去
    });
  } else {
    // 如果已登录且访问登录页，则重定向到首页
    if (to.path === '/login' && isLoggedIn()) {
      next({ path: '/' });
    } else {
      next();
    }
  }
});

export default router;
