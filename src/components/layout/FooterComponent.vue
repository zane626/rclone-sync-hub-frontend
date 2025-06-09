<template>
  <el-footer height="60px" class="footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ currentYear }} <a href="https://github.com/zane626/rclone-sync-hub-frontend" target="_blank">Rclone Sync Hub</a> -
        版本 {{ version }}
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElFooter } from 'element-plus';

import packageJson from '../../../package.json';

// 版本信息
const version = ref(packageJson.version);

// 当前年份
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.footer-content {
  width: 100%;
  text-align: center;
  color: #606266;
  font-size: 14px;
}

a {
  color: #409eff;
  text-decoration: none;
}

.copyright {
  margin: 0;
}
</style>
