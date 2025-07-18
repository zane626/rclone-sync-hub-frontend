<template>
  <div class="tasks-container">
    <div class="page-header">
      <h2>任务列表</h2>
      <!--<el-button type="primary" @click="handleAdd">-->
      <!--  <el-icon><plus /></el-icon> 新增任务-->
      <!--</el-button>-->
    </div>

    <el-card class="box-card">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" @submit.native.prevent>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="状态" clearable @change="handleQuery" style="width: 200px;">
            <el-option label="待上传" :value="0"></el-option>
            <el-option label="队列中" :value="1"></el-option>
            <el-option label="上传中" :value="2"></el-option>
            <el-option label="上传完成" :value="3"></el-option>
            <el-option label="上传失败" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input v-model="queryParams.fileName" placeholder="文件名称" clearable @clear="handleQuery" @keyup.enter.native="handleQuery"></el-input>
        </el-form-item>
        <el-form-item label="文件夹">
          <el-input v-model="queryParams.name" placeholder="文件夹" clearable @clear="handleQuery" @keyup.enter.native="handleQuery"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    </el-card>
    <el-card class="task-table-card" style="margin-top: 20px;">
      <el-button type="primary" :disabled="selected.length === 0" @click="handleDeleteMultiple">批量删除</el-button>
      <el-table :data="dataList" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="文件夹"/>
        <el-table-column prop="fileName" label="文件名称" width="150"/>
        <el-table-column prop="localPath" label="文件路径" width="140"/>
        <el-table-column prop="origin" label="源" width="100"/>
        <el-table-column prop="remotePath" label="远程目录" width="120"/>
        <el-table-column prop="created_at" label="创建时间" width="120">
          <template #default="{row}">
            {{ timeFormat(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{row}">
            <!-- 0: 待上传, 1: 队列中, 2: 上传中, 3: 上传完成, 4: 上传失败 -->
            <el-tag type="info" v-if="row.status === 0">待上传</el-tag>
            <el-tag type="primary" v-if="row.status === 1">队列中</el-tag>
            <el-tag type="warning" v-if="row.status === 2">上传中</el-tag>
            <el-tag type="success" v-if="row.status === 3">上传完成</el-tag>
            <el-tag type="danger" v-if="row.status === 4">上传失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startedAt" label="上传时间" width="120">
          <template #default="{row}">
            {{ timeFormat(row.startedAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="speed" label="速度" width="120">
          <template #default="scope">
            {{ convertMiBToMB(scope.row.speed) }}
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度"/>
        <el-table-column prop="finishedAt" label="完成时间" width="120">
          <template #default="{row}">
            {{ timeFormat(row.finishedAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="用时"/>
        <el-table-column prop="total" label="文件大小"/>
        <el-table-column
            label="操作"
            fixed="right"
            width="140"
        >
          <template #default="{row}">
            <el-space>
              <el-button type="text" @click="showLog(row)">查看</el-button>
              <el-button type="text" @click="reset(row)">重试</el-button>
              <el-button type="danger" @click="handleDelete(row)">删除</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-drawer
        v-model="drawer"
        title="日志"
        size="1000px"
    >
      <div style="white-space: pre-wrap">{{ logs }}</div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useListPage } from 'hooks/listPage'
import * as api from 'api'
import { timeFormat } from 'common'
import { ElMessage, ElMessageBox } from 'element-plus'


// 使用列表页hooks
const {
  // 数据
  queryParams,
  loading,
  dataList,
  currentPage,
  pageSize,
  total,
  // 方法
  fetchList,
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  handleQuery,
} = useListPage({
  defaultQuery: {
    status: undefined,
    fileName: '',
    name: '',
  },
  listFetch: api.getTaskList,
  deleteFetch: api.deleteTask,
})

const dialogVisible = ref(false)

function convertMiBToMB (str) {
  const regex = /(\d+\.?\d*)\s*MiB\/s/i
  const match = (str || '').match(regex)
  if (!match) return ''

  const value = parseFloat(match[1])
  const mbValue = value * 1.048576
  return `${mbValue.toFixed(2)} MB/s`
}

const logs = ref('')
const drawer = ref(false)

function showLog (row) {
  logs.value = row.logs || ''
  drawer.value = true
}
function reset (row) {
  loading.value = true
  api.updateTask(row._id, { ...row, logs: '', status: 0 }).then(() => {
    ElMessage.success('重置成功')
    fetchList()
  }).catch(() => {
    ElMessage.error('重置失败')
  }).finally(() => {
    loading.value = false
  })
}
const selected = ref([])

function handleSelectionChange (rows) {
  selected.value = rows
}

function handleDeleteMultiple () {
  ElMessageBox.confirm(
      '确定要删除该记录吗?',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    loading.value = true
    Promise.all(selected.value.map((item) => api.deleteTask(item._id))).finally(() => {
      fetchList()
      selected.value = []
    }).finally(() => {
      loading.value = false
    })
  })
}

function handleAdd () {
  dialogVisible.value = true
}
</script>

<style scoped>
.tasks-container {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.task-table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
