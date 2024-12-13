<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useRole } from "./hook";

defineOptions({
  name: "featured-post"
});

const {
  pagination,
  loading,
  onSearch,
  cancelFeatured,
  columns,
  dataList,
  handleSizeChange,
  handleCurrentChange
} = useRole();
</script>

<template>
  <div>
    <PureTableBar title="推荐文章" :columns="columns" @refresh="onSearch">
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button type="warning" plain @click="cancelFeatured(row.id)">
              取消推荐
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
