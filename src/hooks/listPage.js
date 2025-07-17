import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

/**
 * 列表页面通用hooks
 * @param {Object} options 配置选项
 * @param {String} options.apiUrl API地址
 * @param {Function} options.transformRequest 请求数据转换函数
 * @param {Function} options.transformResponse 响应数据转换函数
 * @param {Object} options.defaultQuery 默认查询参数
 * @param {Object} options.defaultForm 默认表单数据
 * @param {Object} options.formRules 表单验证规则
 * @param {Function} options.beforeSubmit 提交前处理函数
 * @param {Function} options.afterSubmit 提交后处理函数
 * @returns {Object} 列表页面所需的数据和方法
 */
export function useListPage(options) {
  const {
    apiUrl,
    transformRequest = (data) => data,
    transformResponse = (data) => data,
    defaultQuery = {},
    defaultForm = {},
    formRules = {},
    beforeSubmit = null,
    afterSubmit = null,
    listFetch = null,
    deleteFetch = null,
  } = options;

  // 列表数据
  const loading = ref(false);
  const dataList = ref([]);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  // 查询参数
  const queryParams = reactive({
    ...defaultQuery
  });

  // 表单数据
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const formRef = ref(null);
  const formData = reactive({ ...defaultForm });

  // 重置表单
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    Object.assign(formData, { ...defaultForm });
  };

  // 获取列表数据
  const fetchList = async () => {
    if (!listFetch) throw new Error('listFetch is required');
    loading.value = true;
    try {
      const query = Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (!['', null, undefined].includes(value)) {
          if (typeof value === 'string') {
            acc[key] = { $regex: value.trim() }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      const data = await listFetch({
        query: JSON.stringify(query),
        page: currentPage.value,
        per_page: pageSize.value
      });
      const result = transformResponse(data);
      dataList.value = result.items || [];
      total.value = result.total_items || 0;
      loading.value = false;
      // 模拟API请求
      return result;
    } catch (error) {
      loading.value = false;
      return Promise.reject(error);
    }
  };

  // 分页处理
  const handleSizeChange = (val) => {
    pageSize.value = val;
    fetchList();
  };

  const handleCurrentChange = (val) => {
    currentPage.value = val;
    fetchList();
  };

  // 查询处理
  const handleQuery = () => {
    currentPage.value = 1;
    fetchList();
  };

  const resetQuery = () => {
    Object.assign(queryParams, { ...defaultQuery });
    currentPage.value = 1;
    pageSize.value = 10;
    fetchList();
  };

  // 新增
  const handleAdd = () => {
    isEdit.value = false;
    resetForm();
    dialogVisible.value = true;
  };

  // 编辑
  const handleEdit = (row) => {
    isEdit.value = true;
    resetForm();
    Object.assign(formData, { ...row });
    dialogVisible.value = true;
  };

  // 删除
  const handleDelete = (row, confirmMessage = '确定要删除该记录吗？') => {
    ElMessageBox.confirm(
      confirmMessage,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      try {
        await deleteFetch(row._id || row.id);
        await fetchList();
        ElMessage.success('删除成功');
      } catch (error) {
        ElMessage.error(`删除失败: ${error.message}`);
      }
    }).catch(() => {
      // 取消删除
    });
  };

  // 初始化
  onMounted(() => {
    fetchList();
  });

  return {
    // 数据
    loading,
    dataList,
    currentPage,
    pageSize,
    total,
    queryParams,
    dialogVisible,
    isEdit,
    formRef,
    formData,
    formRules,

    // 方法
    fetchList,
    handleSizeChange,
    handleCurrentChange,
    handleQuery,
    resetQuery,
    handleAdd,
    handleEdit,
    handleDelete,
    resetForm
  };
}
