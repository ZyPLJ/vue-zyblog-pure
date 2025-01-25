import { ref, onMounted, reactive } from "vue";
import { message } from "@/utils/message";
import { getCommentList, deleteComment } from "@/api/comment";
import formatTime from "@/utils/dateTime";
import type { PaginationProps } from "@pureadmin/table";

export function useRole() {
  const form = reactive({
    content: ""
  });
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
      label: "头像",
      prop: "avatar",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-avatar>
          <img
            src={`http://q2.qlogo.cn/headimg_dl?dst_uin=${row.anonymousUser.email.split("@")[0]}&spec=100`}
            width="40"
            height="40"
          />
        </el-avatar>
      )
    },
    {
      label: "文字ID",
      prop: "postId",
      minWidth: 100
    },
    {
      label: "评论者名称",
      prop: "anonymousUser.name",
      minWidth: 100
    },
    {
      label: "回复对象",
      prop: "anonymousUser.name",
      minWidth: 100,
      cellRenderer: ({ row }) =>
        row.parent?.anonymousUser?.name ? row.parent?.anonymousUser?.name : "无"
    },
    {
      label: "邮箱",
      prop: "anonymousUser.email",
      minWidth: 100
    },
    {
      label: "内容",
      prop: "content",
      minWidth: 100
    },
    {
      label: "评论时间",
      prop: "createdTime",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{formatTime(row.createdTime, format)}</span>
      )
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 删除评论 */
  async function handleDelete(id: number) {
    try {
      const res = await deleteComment(id);
      if (res.successful) {
        message(res.message, { type: "success" });
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
      search: form.content
    };
    const { data, pagination } = await getCommentList(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.content = "";
    onSearch();
  };

  function handleSizeChange(val: number) {
    paginations.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    paginations.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    paginations,
    dataList,
    onSearch,
    handleDelete,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}
