<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">选择本地路径</el-button>
    <el-dialog
        title="选择本地路径"
        v-model="dialogVisible"
        width="30%"
    >
      <el-tree
          :data="treeData"
          :props="defaultProps"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
          v-loading="loading"
          highlight-current
          style="height: 400px;overflow-y: auto;width: 100%"
      >
        <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
      </span>
        </template>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getSysTree } from 'api'

const emit = defineEmits(['update:modelValue'])

const dialogVisible = ref(false)
const loading = ref(false)
const treeData = ref([])
const defaultProps = {
  label: 'label',
  children: 'children',
}

const fetchData = async (path = '/') => {
  try {
    loading.value = true
    const data = await getSysTree({ path })
    console.log(data)
    return data.children.filter(i => i.is_dir).map((item) => ({
      id: item.path,
      label: item.name,
      children: [],
    }))
  } catch (error) {
    ElMessage.error('Failed to load directory')
    return []
  } finally {
    loading.value = false
  }
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    resolve(await fetchData())
  } else {
    resolve(await fetchData(node.data.id))
  }
}

const handleNodeClick = (data) => {
  if (!data.children?.length) {
    fetchData(data.id)
  }
  emit('update:modelValue', data.id)
}
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-tree.css';

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 0;
}
</style>
