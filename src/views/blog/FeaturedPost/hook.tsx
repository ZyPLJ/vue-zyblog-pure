import { onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getAll, deleteFeaturedPost, updateSort } from "@/api/featuredpost";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

export function useRole() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const loading = ref(true);
  const dataList = ref([]);
  const Show = ref(false);

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 90
    },
    {
      label: "文章ID",
      prop: "post.id",
      minWidth: 100
    },
    {
      label: "文章标题",
      prop: "post.title",
      minWidth: 100
    },
    {
      label: "文章分类",
      prop: "post.categories.name",
      minWidth: 100
    },
    {
      label: "排序",
      prop: "sortOrder",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-input-number
          v-model={row.sortOrder}
          onChange={value => sortFeatured(row.id, value)}
          min={1}
          max={999}
          controls-position="right"
          size="large"
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];
  function handleSizeChange(val: number) {
    console.log("handleSizeChange", val);
  }
  function handleCurrentChange(val: number) {
    console.log("handleCurrentChange", val);
  }
  // 取消推荐
  async function cancelFeatured(id: number) {
    ElMessageBox.confirm("你确定吗?", "Are you sure?", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning"
    })
      .then(() => {
        deleteFeaturedPost(id)
          .then(res => {
            message(res.message, { type: "success" });
            onSearch();
          })
          .catch(err => {
            message(err.message, { type: "error" });
          });
      })
      .catch(() => {
        message("已取消", { type: "info" });
      });
  }
  // 排序
  async function sortFeatured(id: number, sortOrder: number) {
    Show.value = true;
    try {
      const res = await updateSort(id, sortOrder);
      if (res.successful) {
        message(res.message, { type: "success" });
      } else {
        message(res.message, { type: "error" });
      }
      await onSearch();
    } catch (err) {
      message(err.message, { type: "error" });
    } finally {
      Show.value = false;
    }
  }
  async function onSearch() {
    loading.value = true;
    let req = {
      pageSize: pagination.pageSize,
      page: pagination.currentPage,
      search: ""
    };
    const { data, pagination: apiPagination } = await getAll(req);
    pagination.total = apiPagination.totalItemCount;
    pagination.pageSize = apiPagination.pageSize;
    pagination.currentPage = apiPagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    pagination,
    loading,
    onSearch,
    cancelFeatured,
    sortFeatured,
    columns,
    dataList,
    handleSizeChange,
    handleCurrentChange
  };
}
