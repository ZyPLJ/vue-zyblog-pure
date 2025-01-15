<script setup lang="ts">
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "config"
});

const { loading, columns, dataList, onSearch, handleEdit, handleDeleted } =
  useRole();
</script>

<template>
  <div class="main">
    <PureTableBar title="配置管理" :columns="columns" @refresh="onSearch">
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button type="info" @click="handleEdit(row)">开关评论</el-button>
            <el-popconfirm title="确定要删除吗？" @confirm="handleDeleted(row)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
