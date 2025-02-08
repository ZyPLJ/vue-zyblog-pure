import { ref, onMounted, reactive } from "vue";
import { getList, deleteMsg, deleteMsgReply } from "@/api/message";
import { message } from "@/utils/message";
import formatTime from "@/utils/dateTime";
import type { PaginationProps } from "@pureadmin/table";
export function useRole() {
  const dataList = ref([]);
  const loading = ref(true);
  const format = "yyyy-MM-dd HH:mm:ss";

  const paginations = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "主键",
      prop: "id",
      minWidth: 100
    },
    {
      label: "留言者",
      prop: "name",
      minWidth: 100
    },
    {
      label: "回复人",
      prop: "replyToName",
      minWidth: 100,
      cellRenderer: ({ row }) => (row.replyToName ? row.replyToName : "无")
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 100
    },
    {
      label: "留言内容",
      prop: "message",
      minWidth: 100
    },
    {
      label: "留言时间",
      prop: "createdAt",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{formatTime(row.createdAt, format)}</span>
      )
    },
    {
      label: "是否回复",
      prop: "isReply",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    paginations.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    paginations.currentPage = val;
    onSearch();
  }

  /** 删除 */
  async function handleDelete(row: any) {
    try {
      let res: any;
      if (!row.isReply) {
        res = await deleteMsg(row.id);
      } else {
        res = await deleteMsgReply(row.id);
      }
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
    let req = {
      pageSize: paginations.pageSize,
      page: paginations.currentPage,
      search: ""
    };
    const { data, pagination } = await getList(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    paginations,
    loading,
    columns,
    dataList,
    onSearch,
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
