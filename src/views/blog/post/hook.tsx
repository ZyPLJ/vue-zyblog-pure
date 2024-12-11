import type { PaginationProps } from "@pureadmin/table";
import { type Ref, reactive, ref, onMounted } from "vue";
import { getPostList, deletePost } from "@/api/post";
import formatTime from "@/utils/dateTime";
import { message } from "@/utils/message";
import { isString } from "@pureadmin/utils";
import {
  useRouter,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

export function useRole(tableRef: Ref) {
  const form = reactive({
    title: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const format = "yyyy-MM-dd HH:mm:ss";

  const paginations = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const router = useRouter();

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 90
    },
    {
      label: "标题",
      prop: "title",
      minWidth: 100
    },
    {
      label: "标签",
      prop: "tags",
      minWidth: 100,
      cellRenderer: ({ row }) =>
        row.tags.map(tag => <el-tag key={tag.index}>{tag.name}</el-tag>)
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={row.status === 1 || row.status === null ? "success" : "info"}
        >
          {row.status === 1 || row.status === null ? "已发布" : "未发布"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "creationTime",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{formatTime(row.creationTime, format)}</span>
      )
    },
    {
      label: "上次更新",
      prop: "lastUpdateTime",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{formatTime(row.lastUpdateTime, format)}</span>
      )
    },
    {
      label: "分类",
      prop: "categories.name",
      minWidth: 100
    },
    {
      label: "浏览量",
      prop: "viewCount",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  async function onSearch() {
    loading.value = true;
    let req = {
      pageSize: paginations.pageSize,
      page: paginations.currentPage,
      search: form.title
    };
    const { data, pagination } = await getPostList(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
  /** 删除文章 */
  async function handleDelete(id: string) {
    try {
      const res = await deletePost(id);
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
  /** 编辑 */
  function toEdit(parameter: LocationQueryRaw | RouteParamsRaw) {
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    // 跳转到编辑页面
    useMultiTagsStoreHook().handleTags("push", {
      path: `/blog/post/editPost/:id`,
      name: "edit",
      params: parameter,
      meta: {
        title: `${parameter.id} - 编辑`
      }
    });
    router.push({ name: "edit", params: parameter });
  }
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    paginations,
    selectedNum,
    onSearch,
    handleDelete,
    toEdit,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
