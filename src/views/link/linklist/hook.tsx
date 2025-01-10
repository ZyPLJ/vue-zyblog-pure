import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { getLinkPage, addLink, deleteLink, updateLink } from "@/api/link";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import forms, { type FormProps } from "@/views/link/linklist/form.vue";
export function useRole() {
  const dataList = ref([]);
  const loading = ref(true);
  const formRef = ref();

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
      label: "网站图标",
      prop: "favicon",
      minWidth: 100
    },
    {
      label: "网站描述",
      prop: "description",
      minWidth: 100
    },
    {
      label: "显示状态",
      prop: "visible",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.visible ? "success" : "warning"}>
          {row.visible ? "显示" : "隐藏"}
        </el-tag>
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

  /** 新增 */
  function handleAdd() {
    addDialog({
      width: "30%",
      title: "添加友情链接",
      props: {
        // 赋默认值
        formLink: {
          Name: "",
          Description: "",
          Url: "",
          favicon: "",
          visible: 0
        }
      },
      contentRenderer: () => h(forms, { ref: formRef, formLink: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const { formLink } = options.props as FormProps;
        FormRef.validate(valid => {
          if (valid) {
            addLink(formLink)
              .then(() => {
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
                message("添加成功", { type: "success" });
              })
              .catch(() => {
                message("添加失败", { type: "error" });
              });
          }
        });
      }
    });
  }
  /** 修改 */
  function handleEdit(row: any) {
    addDialog({
      width: "30%",
      title: "修改友情链接",
      props: {
        // 赋默认值
        formLink: {
          Name: row.name,
          Description: row.description,
          Url: row.url,
          favicon: row.favicon,
          visible: row.visible
        }
      },
      contentRenderer: () => h(forms, { ref: formRef, formLink: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const { formLink } = options.props as FormProps;
        FormRef.validate(valid => {
          if (valid) {
            updateLink(row.id, formLink)
              .then(() => {
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
                message("修改成功", { type: "success" });
              })
              .catch(() => {
                message("修改失败", { type: "error" });
              });
          }
        });
      }
    });
  }
  /** 删除 */
  async function handleDeleted(row: any) {
    try {
      const res = await deleteLink(row.id);
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
    const { data, pagination } = await getLinkPage(req);
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
    handleCurrentChange,
    handleAdd,
    handleDeleted,
    handleEdit
  };
}
