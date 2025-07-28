<template>
  <div class="tasks-container">
    <div class="page-header">
      <h2>origin</h2>
    </div>


    <el-card class="task-table-card" style="margin-top: 20px;">
      <el-button type="primary" @click="refresh" v-loading="loading">刷新</el-button>
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="文件夹"/>
        <el-table-column prop="count" label="文件数量" width="150"/>
        <el-table-column prop="bytes" label="使用大小" width="140">
          <template #default="scope">
            {{ bytesFormat(scope.row.bytes) }}
          </template>
        </el-table-column>
        <el-table-column prop="sizeless" label="sizeless" width="100"/>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useListPage } from 'hooks/listPage'
import * as api from 'api'


// 使用列表页hooks
const {
  // 数据
  loading,
  dataList,
  currentPage,
  pageSize,
  total,
  // 方法
  fetchList,
  handleSizeChange,
  handleCurrentChange,
} = useListPage({
  defaultQuery: {
    status: undefined,
    fileName: '',
    name: '',
  },
  listFetch: api.originList,
})


// 将bytes转换成合适的单位
function bytesFormat (str) {
  const d = ['KB', 'MB', 'GB', 'TB']
  let result = ''
  let val = str
  d.forEach((_d) => {
    val = val / 1024
    if (!result && val < 1024) {
      result = parseFloat(val).toFixed(2) + _d
    }
  })
  return result
}


function refresh () {
  loading.value = true
  api.refreshOrigins().then(res => {
    fetchList()
  }).finally(() => {
    loading.value = false
  })
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
