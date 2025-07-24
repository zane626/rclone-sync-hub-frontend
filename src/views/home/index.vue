<template>
  <el-space direction="vertical" fill style="width: 100%;" :size="24">
    <el-row :gutter="24">
      <el-col :span="6" v-for="item in cardField" :key="item.title">
        <div class="statistic-card">
          <el-statistic :value="item.num">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                {{ item.title }}
                <el-tooltip
                    effect="dark"
                    :content="item.tips"
                    placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning/>
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="18">
        <DailyStatistics ref="DailyStatisticsRef" />
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近动态</span>
            </div>
          </template>
          <p v-for="o in dynamic" :key="o" class="text item">{{ 'List item ' + o }}</p>
        </el-card>
      </el-col>
    </el-row>
  </el-space>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import DailyStatistics from './components/DailyStatistics.vue'
import { getAnalysis } from 'api'

const cardField = ref([
  {
    title: '监听文件夹',
    tips: '总监听文件夹数量',
    num: 0,
  },
  {
    title: '上传中',
    tips: '上传中的文件数量',
    num: 0,
  },
  {
    title: '待上传',
    tips: '等待上传文件数量',
    num: 0,
  },
  {
    title: '已上传',
    tips: '已上传文件数量',
    num: 0,
  },
])

const DailyStatisticsRef = ref(null)
const dynamic = ref([])

onMounted(() => {
  getAnalysis().then(res => {
    cardField.value[0].num = res.folders
    cardField.value[1].num = res.uploaded
    cardField.value[2].num = res.toBeUploaded
    cardField.value[3].num = res.success
    dynamic.value = res.logs || []
    DailyStatisticsRef.value.setValue(res.final_result || [])
  })
})
</script>

<style scoped lang="scss">
.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}
</style>
