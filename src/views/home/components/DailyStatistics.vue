<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>日统计概览</span>
      </div>
    </template>
    <DailyStatisticsOverview ref="DailyStatisticsOverviewRef"/>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DailyStatisticsOverview from '@/components/Echarts/DailyStatisticsOverview.vue'

const DailyStatisticsOverviewRef = ref(null)

function setValue (value) {
  DailyStatisticsOverviewRef.value.setOption(value)
}

defineExpose({
  setValue
})

</script>

<style scoped>

</style>
