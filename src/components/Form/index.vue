<template>
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="140px">
      <el-form-item
          v-for="item in formItemsFilter"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
      >
        <!-- 根据不同的表单类型渲染对应的组件 -->
        <template v-if="item.type === 'input'">
          <el-input
              v-model="formModel[item.prop]"
              :placeholder="item.placeholder"
              @change="changeValue(item.prop, formModel[item.prop])"
          />
        </template>

        <template v-else-if="item.type === 'select'">
          <el-select
              v-model="formModel[item.prop]"
              :placeholder="item.placeholder"
              @change="changeValue(item.prop, formModel[item.prop])"
          >
            <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </template>
        <template v-else-if="SelectDir">
          <el-space>
            <el-input v-model="formModel[item.prop]" placeholder="请选择或输入"></el-input>
            <SelectDir v-model="formModel[item.prop]"/>
          </el-space>
        </template>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
</template>

<script setup>
import { computed, ref } from 'vue'
import SelectDir from './selectDir.vue'

const props = defineProps({
  formItems: {
    type: Array,
    default: () => []
  },
  initialValues: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  }
})

const formRef = ref()
const formModel = ref({
  ...props.initialValues
})
const formItemsFilter = computed(() => props.formItems.filter(item => 'isShow' in item ? item.isShow : true))

const emit = defineEmits(['submit', 'cancel',  'changeValue'])

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit', formModel.value)
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  formRef.value.resetFields()
  emit('cancel')
}

function changeValue (prop, value) {
  emit('changeValue', prop, value)
}
</script>
