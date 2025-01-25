import { ref, onMounted } from "vue";
import { getAll, isShow, deleteConfig, addConfig } from "@/api/config";
import { message } from "@/utils/message";
import forms, { type FormProps } from "@/views/System/config/form.vue";
import { addDialog } from "@/components/ReDialog/index";

export function useRole() {
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "key",
      prop: "key",
      minWidth: 100
    },
    {
      label: "value",
      prop: "value",
      minWidth: 100
    },
    {
      label: "description",
      prop: "description",
      minWidth: 100
    },
    {
      label: "isShowComment",
      prop: "isShowComment",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];
  /** 显示隐藏评论 */
  async function handleEdit(row: any) {
    const res = await isShow(row.id);
    if (res.successful) {
      message(res.message, { type: "success" });
    } else {
      message(res.message, { type: "error" });
    }
    await onSearch();
  }

  /** 删除 */
  async function handleDeleted(row: any) {
    try {
      const res = await deleteConfig(row.id);
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

  /** 查询 */
  async function onSearch() {
    loading.value = true;
    const { data } = await getAll();
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  /** 添加 */
  function handleAdd() {
    addDialog({
      width: "30%",
      title: "添加配置",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formConfig: {
          key: "",
          value: "",
          description: "",
          isShowComment: false
        }
      },
      closeCallBack: ({ options, args }) => {
        const { formConfig } = options.props as FormProps;
        if (args?.command === "sure") {
          addConfig(formConfig).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        }
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    handleEdit,
    handleDeleted,
    handleAdd
  };
}
