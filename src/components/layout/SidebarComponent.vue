<template>
  <el-aside width="200px" class="sidebar">
    <el-menu
      router
      default-active="/home"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF">
      <el-menu-item index="/home">
        <el-icon><folder /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/folders">
        <el-icon><folder /></el-icon>
        <span>文件夹列表</span>
      </el-menu-item>
      <el-menu-item index="/tasks">
        <el-icon><list /></el-icon>
        <span>任务列表</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { Folder, List } from '@element-plus/icons-vue';
import {
  ElAside,
  ElMenu,
  ElMenuItem,
  ElIcon
} from 'element-plus';
</script>

<style scoped>
.sidebar {
  background-color: #304156;
  height: calc(100vh - 60px); /* 调整高度以适应新增的footer */
}

.sidebar-menu {
  border-right: none;
}
</style>
