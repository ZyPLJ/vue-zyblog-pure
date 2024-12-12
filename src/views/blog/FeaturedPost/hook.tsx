import { onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getAll } from "@/api/featuredpost";

export function useRole() {
  const paginations = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const loading = ref(true);
  const dataList = ref([]);

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
          min="1"
          max="999"
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
  // async function cancelFeatured(row: any) {
  //   console.log("cancelFeatured", row);
  // }
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
    paginations,
    loading,
    onSearch,
    columns,
    dataList,
    handleSizeChange,
    handleCurrentChange
  };
}
