<template>
  <div class="folders-container">
    <div class="page-header">
      <h2>文件夹列表</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <plus/>
        </el-icon>
        新增文件夹
      </el-button>
    </div>

    <el-card class="folder-table-card">
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="名称" min-width="100"/>
        <el-table-column prop="localPath" label="目标目录" width="200"/>
        <el-table-column prop="origin" label="源" width="200"/>
        <el-table-column prop="remotePath" label="远程目录" width="200"/>
        <el-table-column prop="uploadNum" label="已上传数量" width="120" align="center"/>
        <el-table-column prop="created_at" label="创建时间" width="200">
          <template #default="{row}">
            {{ timeFormat(row.created_at)}}
          </template>
        </el-table-column>
        <el-table-column prop="lastSyncAt" label="最后查询时间" width="200">
          <template #default="{row}">
            {{ timeFormat(row.lastSyncAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{row}">
            <el-tag type="info" v-if="row.status === 0">等待检测文件</el-tag>
            <el-tag type="warning" v-else-if="row.status === 1">检测文件中</el-tag>
            <el-tag type="success" v-else-if="row.status === 2">监听中</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template #default="{row}">
            <el-space>
              <!--<el-button type="primary">刷新</el-button>-->
              <!--<el-button type="primary">编辑</el-button>-->
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
    <add-dialog
      v-model:visible="dialogVisible"
      ref="addDialog"
      @add="handleQuery"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useListPage } from 'hooks/listPage'
import * as api from 'api'
import { timeFormat } from 'common'
import AddDialog from './add.vue'


// 使用列表页hooks
const {
  // 数据
  loading,
  dataList,
  currentPage,
  pageSize,
  total,
  // 方法
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  handleQuery,
} = useListPage({
  listFetch: api.getFolderList,
  deleteFetch: api.deleteFetch,
})

const dialogVisible = ref(false)

function handleAdd () {
  dialogVisible.value = true
}
</script>

<style scoped>
.folders-container {
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

.folder-table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
