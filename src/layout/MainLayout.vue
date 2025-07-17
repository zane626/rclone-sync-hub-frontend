<template>
  <el-container class="layout-container">
    <header-component />
    <el-container class="el-container">
      <sidebar-component />
      <el-container class="main-container">
        <el-main class="main-content">
          <router-view />
        </el-main>
        <footer-component />
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElContainer, ElMain } from 'element-plus';
import HeaderComponent from '../components/layout/HeaderComponent.vue';
import SidebarComponent from '../components/layout/SidebarComponent.vue';
import FooterComponent from '../components/layout/FooterComponent.vue';
</script>

<style scoped>
.layout-container {
  height: 100vh;
  flex-direction: column;
}
.el-container {
  overflow: auto;
}
.main-container {
  display: flex;
  flex-direction: column;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  flex: 1;
}
</style>
