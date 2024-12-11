<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import View from "@iconify-icons/ep/view";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/refresh";
import Eye from "@iconify-icons/ant-design/eye-invisible";
import EyeOne from "@iconify-icons/ant-design/eye-twotone";

defineOptions({
  name: "category"
});

const {
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
} = useRole();
</script>

<template>
  <div class="main">
    <PureTableBar title="分类列表" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="id"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...paginations, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button type="success" @click="onSetFeatured(row)">
              设置推荐
            </el-button>
            <el-popconfirm
              title="确定要取消推荐吗？"
              @confirm="onCancelFeatured(row.id)"
            >
              <template #reference>
                <el-button
                  type="warning"
                  :disabled="!(row?.featuredCategory?.id > 0)"
                >
                  取消推荐
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm title="确定要删除吗？" @confirm="onDeleted(row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button
              type="primary"
              plain
              @click="setVisibleOrInvisible(row.id, !row.visible)"
            >
              <IconifyIconOffline
                :icon="row.visible ? Eye : EyeOne"
                width="20px"
                height="20px"
              />
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
