<template>
  <!-- 新增/编辑文件夹对话框 -->
  <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文件夹' : '新增文件夹'"
      width="500px"
  >
    <form-element
        v-loading="loading"
        :formItems="formItems"
        :initialValues="initialValues"
        @submit="submit"
        @cancel="cancel"
    />
  </el-dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import FormElement from 'components/Form/index.vue'
import { createFolder, getRemoteList } from 'api'
import _ from 'lodash'

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

const initialValues = {
  name: '',
  type: 'local',
  localPath: '',
}
const formItems = ref([
  {
    label: '名称',
    prop: 'name',
    type: 'input',
    placeholder: '请输入名称'
  },
  {
    label: '上传类型',
    prop: 'type',
    type: 'select',
    placeholder: '请选择类型',
    defaultValue: 'local',
    options: [
      { label: '本地->云', value: 'local' },
      { label: '云->云', value: 'remote' },
    ],
  },
  {
    label: '本地目录',
    prop: 'localPath',
    type: 'SelectDir',
    isShow: true,
  },
  {
    label: '来源云盘',
    prop: 'target_origin',
    type: 'select',
    isShow: false,
    placeholder: '请选择源',
    options: [],
  },
  {
    label: '本地目录',
    prop: 'originPath',
    type: 'input',
    isShow: false,
  },
  {
    label: '目标云盘',
    prop: 'origin',
    type: 'select',
    placeholder: '请选择源',
    options: [],
  },
  {
    label: '目标目录',
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

function getIndex (prop) {
  return _.findIndex(formItems.value, { prop })
}

onMounted(() => {
  getRemoteList().then((data) => {
    formItems.value[getIndex('origin')].options = data.map((item) => ({ label: item, value: item }))
  })
})
</script>
