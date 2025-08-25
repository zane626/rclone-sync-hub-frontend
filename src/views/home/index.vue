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
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>最近动态</span>
              <el-icon><Clock /></el-icon>
            </div>
          </template>
          <div class="activity-container">
            <div v-if="dynamic.length === 0" class="no-activity">
              <el-empty description="暂无动态" :image-size="80" />
            </div>
            <div v-else class="activity-list">
              <div 
                v-for="item in dynamic" 
                :key="item._id" 
                class="activity-item"
              >
                <div class="activity-time">
                  <span class="time-text">{{ formatTime(item.created_at) }}</span>
                </div>
                <div class="activity-content">
                  <div class="activity-name">{{ item.name }}</div>
                  <div class="activity-description">{{ item.description }}</div>
                </div>
                <div class="activity-indicator"></div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-space>
</template>

<script setup lang="ts">
import { Warning, Clock } from '@element-plus/icons-vue'
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

// 格式化时间函数
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }
  // 超过7天显示具体日期
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

.activity-card {
  height: 100%;
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: var(--el-text-color-primary);
    
    .el-icon {
      color: var(--el-color-primary);
    }
  }
}

.activity-container {
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 2px;
    
    // &:hover {
    //   background: var(--el-border-color-darker);
    // }
  }
}

.no-activity {
  padding: 20px 0;
  text-align: center;
}

.activity-list {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--el-color-primary-light-7), var(--el-color-primary-light-9));
    border-radius: 1px;
  }
}

.activity-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  margin-left: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  // &:hover {
  //   background-color: var(--el-fill-color-extra-light);
  //   margin: 12px -8px;
  //   padding: 12px 8px;
  //   border-radius: 6px;
  //   
  //   .activity-indicator {
  //     transform: scale(1.2);
  //     background-color: var(--el-color-primary);
  //   }
  // }
}

.activity-indicator {
  position: absolute;
  left: -28px;
  top: 16px;
  width: 8px;
  height: 8px;
  background-color: var(--el-color-primary-light-5);
  border: 2px solid var(--el-bg-color);
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 1;
}

.activity-time {
  min-width: 60px;
  margin-right: 12px;
  
  .time-text {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
    line-height: 1.2;
  }
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  line-height: 1.3;
  word-break: break-word;
}

.activity-description {
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 响应式适配
@media (max-width: 768px) {
  .activity-item {
    margin-left: 16px;
    
    // &:hover {
    //   margin: 12px -4px;
    //   padding: 12px 4px;
    // }
  }
  
  .activity-indicator {
    left: -24px;
  }
  
  .activity-time {
    min-width: 50px;
    margin-right: 8px;
    
    .time-text {
      font-size: 10px;
    }
  }
  
  .activity-name {
    font-size: 12px;
  }
  
  .activity-description {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .activity-container {
    max-height: 300px;
  }
  
  .activity-item {
    padding: 8px 0;
    margin-left: 12px;
  }
  
  .activity-indicator {
    left: -20px;
    width: 6px;
    height: 6px;
  }
  
  .activity-time {
    min-width: 45px;
    margin-right: 6px;
  }
}
</style>
