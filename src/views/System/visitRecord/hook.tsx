import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { getList } from "@/api/visitRecord";
import formatTime from "@/utils/dateTime";
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
      label: "IP地址",
      prop: "ip",
      minWidth: 100
    },
    {
      label: "请求地址",
      prop: "requestPath",
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: "请求参数",
      prop: "requestQueryString",
      minWidth: 100
    },
    {
      label: "请求方式",
      prop: "requestMethod",
      minWidth: 100
    },
    {
      label: "UA信息",
      prop: "userAgent",
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: "访问时间",
      prop: "time",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => <span>{formatTime(row.time, format)}</span>
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
    loading,
    columns,
    dataList,
    paginations,
    onSearch,
    handleSizeChange,
    handleCurrentChange
  };
}
