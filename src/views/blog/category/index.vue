<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import View from "@iconify-icons/ep/view";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/refresh";

defineOptions({
  name: "category"
});

const tableRef = ref();
const {
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
} = useRole(tableRef);
</script>

<template>
  <div class="main">
    <PureTableBar title="分类列表" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button type="success" @click="onSetFeatured(row)">
              设置推荐
            </el-button>
            <el-button
              type="warning"
              :disabled="!(row?.featuredCategory?.id > 0)"
            >
              取消推荐
            </el-button>
            <el-button type="primary">修改分类</el-button>
            <el-button type="danger" @click="onDeleted(row.id)">删除</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
