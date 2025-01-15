import { ref, onMounted } from "vue";
import { getAll, isShow, deleteConfig } from "@/api/config";
import { message } from "@/utils/message";
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

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    handleEdit,
    handleDeleted
  };
}
