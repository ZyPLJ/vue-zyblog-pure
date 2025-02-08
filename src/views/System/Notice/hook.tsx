import { ref, onMounted } from "vue";
import { getNotice, addNotice, deleteNotice } from "@/api/notice";
import { addDialog } from "@/components/ReDialog/index";
import forms, { type FormProps } from "@/views/System/Notice/form.vue";
import { message } from "@/utils/message";
export function useRole() {
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "主键",
      prop: "id",
      minWidth: 100
    },
    {
      label: "正文",
      prop: "content",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 查询 */
  async function onSearch() {
    loading.value = true;
    const { data } = await getNotice();

    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  /** 添加 */
  function handleAdd() {
    addDialog({
      width: "30%",
      title: "添加公告",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formNotice: {
          Content: ""
        }
      },
      closeCallBack: ({ options, args }) => {
        const { formNotice } = options.props as FormProps;
        if (args?.command === "sure") {
          addNotice(formNotice.Content).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        }
      }
    });
  }

  /** 删除 */
  async function handleDelete(row: any) {
    try {
      const res = await deleteNotice(row.id);
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

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    handleAdd,
    handleDelete
  };
}
