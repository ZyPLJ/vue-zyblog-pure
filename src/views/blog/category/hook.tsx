import type { PaginationProps } from "@pureadmin/table";
import { type Ref, reactive, ref, onMounted } from "vue";
import { getCategoryList, setFeatured } from "@/api/categroy";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import forms, { type FormProps } from "./form.vue";

export function useRole(tableRef: Ref) {
  const form = reactive({
    module: "",
    requestTime: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);

  const pagination = reactive<PaginationProps>({
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
      label: "名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "层级",
      prop: "parentId",
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
      label: "推荐名称",
      prop: "featuredCategory.name",
      minWidth: 100
    },
    {
      label: "图标名称",
      prop: "featuredCategory.iconCssClass",
      minWidth: 100
    },
    {
      label: "描述",
      prop: "featuredCategory.description",
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

  /** 设置推荐 */
  function onSetFeatured(row: any) {
    addDialog({
      width: "30%",
      title: "设置推荐",
      contentRenderer: () => forms,
      props: {
        // 赋默认值
        formCategory: {
          name: row.name,
          description: "",
          iconCssClass: ""
        }
      },
      closeCallBack: ({ options, args }) => {
        // options.props 是响应式的
        const { formCategory } = options.props as FormProps;
        const text = `名称：${formCategory.name} 描述：${formCategory.description} 图标：${formCategory.iconCssClass}`;
        if (args?.command === "cancel") {
          // 您点击了取消按钮
          message(`您点击了取消按钮，当前表单数据为 ${text}`);
        } else if (args?.command === "sure") {
          setFeatured(row.id, formCategory).then(() => {
            message(`设置推荐成功，当前表单数据为 ${text}`);
            onSearch();
          });
        } else {
          message(
            `您点击了右上角关闭按钮或空白页或按下了esc键，当前表单数据为 ${text}`
          );
        }
      }
    });
  }
  /** 取消推荐 */
  // function onCancelFeatured(row: any) {
  //   console.log(row);
  // }
  /** 删除 */
  function onDeleted(row: any) {
    console.log(row);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getCategoryList();
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
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
    pagination,
    selectedNum,
    onSearch,
    onSetFeatured,
    onDeleted,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
