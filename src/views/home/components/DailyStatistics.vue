<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>日统计概览</span>
      </div>
    </template>
    <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
  </el-card>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
