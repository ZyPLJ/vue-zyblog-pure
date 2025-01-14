import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import {
  getLinkExchangePage,
  acceptLinkExchange,
  rejectLinkExchange,
  deleteLinkExchange
} from "@/api/linkExchange";
import formatTime from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog/index";
import forms, { type FormProps } from "@/views/link/exchange/form.vue";
import { message } from "@/utils/message";

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
      label: "ID",
      prop: "id",
      minWidth: 90
    },
    {
      label: "网站名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "网站URL",
      prop: "url",
      minWidth: 100
    },
    {
      label: "网站主人",
      prop: "webMaster",
      minWidth: 100
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 100
    },
    {
      label: "网站描述",
      prop: "description",
      minWidth: 100
    },
    {
      label: "显示状态",
      prop: "verified",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.verified ? "success" : "warning"}>
          {row.verified ? "显示" : "隐藏"}
        </el-tag>
      )
    },
    {
      label: "原因",
      prop: "reason",
      minWidth: 100
    },
    {
      label: "上次更新",
      prop: "applyTime",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{formatTime(row.applyTime, format)}</span>
      )
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

  /** 查询 */
  async function onSearch() {
    loading.value = true;
    let req = {
      pageSize: paginations.pageSize,
      page: paginations.currentPage,
      search: ""
    };
    const { data, pagination } = await getLinkExchangePage(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
  /** 通过 */
  function handleAccept(row: any) {
    addDialog({
      width: "30%",
      title: "补充信息",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formExchangeLink: {
          id: row.id,
          action: "accept",
          reason: ""
        }
      },
      closeCallBack: ({ options, args }) => {
        const { formExchangeLink } = options.props as FormProps;
        if (args?.command === "sure") {
          let req = {
            Reason: formExchangeLink.reason
          };
          acceptLinkExchange(row.id, req).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        }
      }
    });
  }
  /** 拒绝 */
  function handleReject(row: any) {
    addDialog({
      width: "30%",
      title: "补充信息",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formExchangeLink: {
          id: row.id,
          action: "reject",
          reason: ""
        }
      },
      closeCallBack: ({ options, args }) => {
        const { formExchangeLink } = options.props as FormProps;
        if (args?.command === "sure") {
          let req = {
            Reason: formExchangeLink.reason
          };
          rejectLinkExchange(row.id, req).then(res => {
            message(res.message, { type: "success" });
            onSearch();
          });
        }
      }
    });
  }
  /** 删除 */
  async function handleDeleted(row: any) {
    try {
      const res = await deleteLinkExchange(row.id);
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
    paginations,
    onSearch,
    handleSizeChange,
    handleCurrentChange,
    handleAccept,
    handleReject,
    handleDeleted
  };
}
