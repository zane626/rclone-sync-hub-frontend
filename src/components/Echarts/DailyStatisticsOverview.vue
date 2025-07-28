<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import _ from 'lodash'

const chartRef = ref(null)
let chartInstance = null

function setOption (list) {
  const option = {
    width: '100%',
    title: {
      text: ''
    },
    tooltip: {},
    legend: {},
    grid: {
      left: '0%',
      right: '10%',
      containLabel: true
    },
    xAxis: {
      data: _.map(list, 'date'),
      axisLabel: {
        interval: 0,       // 强制显示全部标签
        rotate: 0         // 旋转30度，避免标签重叠
      }
    },
    yAxis: {},
    series: [
      {
        name: '添加数量',
        type: 'bar',
        data: _.map(list, 'add'),
        barWidth: '20',           // 可以是数字或百分比
        barCategoryGap: '30%'     // 两组柱子间距
      },
      {
        name: '上传数量',
        type: 'line',
        data: _.map(list, 'success'),
        barWidth: '20',           // 可以是数字或百分比
        barCategoryGap: '30%'     // 两组柱子间距
      }
    ]
  }

  chartInstance?.setOption(option)
}

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

defineExpose({
  setOption
})
</script>

<style scoped>

</style>
