import { onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getTagList, delTag, addTag, updateTag } from "@/api/tag";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog/index";
import forms, { type FormProps } from "./form.vue";

export function useRole() {
  const form = reactive({
    name: ""
  });
  const paginations = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const loading = ref(true);
  const dataList = ref([]);

  function handleSizeChange(val: number) {
    paginations.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    paginations.currentPage = val;
    onSearch();
  }

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 90
    },
    {
      label: "标签名称",
      prop: "name",
      minWidth: 100,
      cellRenderer: ({ row }) => <el-tag type="primary">{row.name}</el-tag>
    },
    {
      label: "文章数量",
      prop: "postCount",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    let req = {
      pageSize: paginations.pageSize,
      page: paginations.currentPage,
      search: form.name
    };
    const { data, pagination } = await getTagList(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function handleDelete(id: number) {
    try {
      const res = await delTag(id);
      if (res.successful) {
        message(`删除成功`, { type: "success" });
      } else {
        message(res.message, { type: "error" });
      }
    } catch (e) {
      if (e.response) {
        message(e.response.data.message, { type: "error" });
      } else {
        message(e.message, { type: "error" });
      }
    } finally {
      onSearch();
    }
  }

  async function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    form.name = "";
    await onSearch();
  }

  /** 新增标签 */
  function handleAdd() {
    addDialog({
      width: "30%",
      title: "新增标签",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formTag: {
          TagName: ""
        }
      },
      closeCallBack: ({ options, args }) => {
        // options.props 是响应式的
        const { formTag } = options.props as FormProps;
        const text = `标签名称：${formTag.TagName}`;
        if (args?.command === "cancel") {
          message(`您点击了取消按钮，当前表单数据为 ${text}`);
        } else if (args?.command === "sure") {
          addTag(formTag).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        } else {
          message(
            `您点击了右上角关闭按钮或空白页或按下了esc键，当前表单数据为 ${text}`
          );
        }
      }
    });
  }

  /** 修改标签 */
  function handleEdit(row: any) {
    addDialog({
      width: "30%",
      title: "修改标签",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formTag: {
          TagName: row.name
        }
      },
      closeCallBack: ({ options, args }) => {
        // options.props 是响应式的
        const { formTag } = options.props as FormProps;
        const text = `标签名称：${formTag.TagName}`;
        if (args?.command === "cancel") {
          message(`您点击了取消按钮，当前表单数据为 ${text}`);
        } else if (args?.command === "sure") {
          const req = {
            id: row.id,
            name: formTag.TagName
          };
          updateTag(req).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        } else {
          message(
            `您点击了右上角关闭按钮或空白页或按下了esc键，当前表单数据为 ${text}`
          );
        }
      }
    });
  }

  onMounted(async () => {
    await onSearch();
  });

  return {
    form,
    paginations,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    handleAdd,
    handleEdit
  };
}
