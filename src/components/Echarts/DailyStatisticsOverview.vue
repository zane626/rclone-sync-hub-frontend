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
    title: {
      text: ''
    },
    tooltip: {},
    legend: {},
    xAxis: {
      data: _.map(list, 'date')
    },
    yAxis: {},
    series: [
      {
        name: '添加数量',
        type: 'bar',
        data: _.map(list, 'add')
      },
      {
        name: '上传数量',
        type: 'bar',
        data: _.map(list, 'success')
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
