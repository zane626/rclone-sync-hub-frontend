<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo">
        <h2>后台管理系统</h2>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { setToken, setUserInfo } from '../utils/auth';

// 路由实例
const router = useRouter();
const route = useRoute();

// 表单引用
const loginFormRef = ref(null);

// 加载状态
const loading = ref(false);

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
  ]
};

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;

      // 模拟登录请求
      setTimeout(() => {
        // 这里应该是实际的登录API调用
        // 假设用户名为admin，密码为123456时登录成功
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          // 保存登录状态
          const token = 'mock-token-123456';
          const userInfo = {
            username: loginForm.username,
            role: 'admin',
            avatar: ''
          };

          // 保存到localStorage
          setToken(token);
          setUserInfo(userInfo);

          // 登录成功提示
          ElMessage.success('登录成功');

          // 获取重定向路径（如果有）
          const redirectPath = route.query.redirect || '/';

          // 跳转到重定向路径或首页
          router.push(redirectPath);
        } else {
          // 登录失败提示
          ElMessage.error('用户名或密码错误');
        }

        loading.value = false;
      }, 1000);
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjYwMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzE4OTBmZiIgZmlsbC1vcGFjaXR5PSIuMDQiIGQ9Ik0wIDBoMTQ0MHY2MDBIMHoiLz48cGF0aCBzdHJva2U9IiMxODkwZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDgiIGQ9Ik0tNTc0LjUzIDYwMEMtMzk5LjY2IDQ0Ny43OSAxOTYuMzEgNTAuNTggMzIwLjM5IDUwLjU4YzI1My4zIDAgMzMwLjQ4IDIxOC40MSA1MzQuMTUgMjE4LjQxIDIwMy42NiAwIDMzNy41LTU0LjYgNTg1LjQ2LTIxOC40MSIvPjwvc3ZnPg==');
  background-repeat: no-repeat;
  background-size: cover;
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-logo {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo h2 {
  margin: 0;
  color: #409EFF;
  font-size: 24px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}
</style>
