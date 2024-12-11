import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, computed } from "vue";
import {
  getCategoryList,
  setFeatured,
  CancelFeatured,
  deleteCategory,
  updateCategory,
  setVisible,
  setInvisible
} from "@/api/categroy";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import forms, { type FormProps } from "./form.vue";
import EditPen from "@iconify-icons/ep/edit-pen";
import Check from "@iconify-icons/ep/check";

export function useRole() {
  const dataList = ref([]);
  const loading = ref(true);

  const paginations = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const editMap = ref({});
  const activeIndex = ref(-1);
  const editing = computed(() => {
    return index => {
      return editMap.value[index]?.editing;
    };
  });
  const iconClass = computed(() => {
    return (index, other = false) => {
      return [
        "cursor-pointer",
        "ml-2",
        "transition",
        "delay-100",
        other
          ? ["hover:scale-110", "hover:text-red-500"]
          : editing.value(index) && ["scale-150", "text-red-500"]
      ];
    };
  });

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 90
    },
    {
      label: "名称(可修改)",
      prop: "name",
      cellRenderer: ({ row, index }) => (
        <div
          class="flex-bc w-full h-[32px]"
          onMouseenter={() => (activeIndex.value = index)}
          onMouseleave={() => onMouseleave(index)}
        >
          {!editing.value(index) ? (
            <p>{row.name}</p>
          ) : (
            <>
              <el-input v-model={row.name} />
              <iconify-icon-offline
                icon={Check}
                class={iconClass.value(index)}
                onClick={() => onSave(index)}
              />
            </>
          )}
          <iconify-icon-offline
            v-show={activeIndex.value === index && !editing.value(index)}
            icon={EditPen}
            class={iconClass.value(index, true)}
            onClick={() => onEdit(row, index)}
          />
        </div>
      )
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
  /** 名称列修改保存触发 */
  function onSave(index: number) {
    const { name } = dataList.value[index];
    const { id } = dataList.value[index];
    updateCategory(id, { name }).then(() => {
      message(`修改成功`, { type: "success" });
    });
    editMap.value[index].editing = false;
  }
  function onEdit(row: any, index: number) {
    editMap.value[index] = Object.assign({ ...row, editing: true });
  }
  function onMouseleave(index: number) {
    editing.value[index]
      ? (activeIndex.value = index)
      : (activeIndex.value = -1);
  }

  function handleSizeChange(val: number) {
    paginations.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    paginations.currentPage = val;
    onSearch();
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
  function onCancelFeatured(row: any) {
    CancelFeatured(row).then(() => {
      message(`取消推荐成功`, { type: "success" });
      onSearch();
    });
  }
  /** 删除 */
  async function onDeleted(row: any) {
    try {
      const res = await deleteCategory(row);
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
    const { data, pagination } = await getCategoryList(req);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
  /** 设置可见或不可见 */
  async function setVisibleOrInvisible(id: number, visible: boolean) {
    if (visible) {
      await setVisible(id);
      message(`设置可见成功`, { type: "success" });
      onSearch();
    } else {
      await setInvisible(id);
      message(`设置不可见成功`, { type: "success" });
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
    onSetFeatured,
    onCancelFeatured,
    onDeleted,
    setVisibleOrInvisible,
    handleSizeChange,
    handleCurrentChange
  };
}
