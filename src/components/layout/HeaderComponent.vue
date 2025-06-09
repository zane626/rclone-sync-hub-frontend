<template>
  <el-header class="header">
    <div class="logo">后台管理系统</div>
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="user-dropdown">
          {{ userInfo.username || '管理员' }} <el-icon><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { getUserInfo, logout } from '../../utils/auth';
import {
  ElHeader,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon
} from 'element-plus';

// 路由实例
const router = useRouter();

// 用户信息
const userInfo = ref({});

// 获取用户信息
onMounted(() => {
  userInfo.value = getUserInfo() || {};
});

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      // 执行登出操作
      logout();
      // 跳转到登录页
      router.push('/login');
    }).catch(() => {});
  } else if (command === 'profile') {
    // 跳转到个人信息页面，这里暂时不实现
    // router.push('/profile');
  }
};
</script>

<style scoped>
.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>