<template>
  <!-- 新增/编辑文件夹对话框 -->
  <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文件夹' : '新增文件夹'"
      width="500px"
  >
    <form-element v-loading="loading" :formItems="formItems" @submit="submit" @cancel="cancel"/>
  </el-dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import FormElement from 'components/Form/index.vue'
import { createFolder, getRemoteList } from 'api'

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
})
const emit = defineEmits(['update:value', 'add', 'edit'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})
const loading = ref(false)

const formItems = ref([
  {
    label: '名称',
    prop: 'name',
    type: 'input',
    placeholder: '请输入名称'
  },
  {
    label: '目标目录',
    prop: 'localPath',
    type: 'SelectDir',
  },
  {
    label: '源',
    prop: 'origin',
    type: 'select',
    placeholder: '请选择源',
    options: [],
  },
  {
    label: '远程目录',
    prop: 'remotePath',
    type: 'input',
  }
])

async function submit (form) {
  console.log(form)
  loading.value = true
  try {
    await createFolder(form)
    dialogVisible.value = false
    emit('add')
  } finally {
    loading.value = false
  }
}

function cancel () {
  dialogVisible.value = false
}

onMounted(() => {
  getRemoteList().then((data) => {
    formItems.value[2].options = data.map((item) => ({ label: item, value: item }))
  })
})
</script>
