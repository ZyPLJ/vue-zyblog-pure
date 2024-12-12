<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import PlusOutlined from "@iconify-icons/ant-design/plus-outlined";
import Refresh from "@iconify-icons/ep/refresh";

defineOptions({
  name: "post"
});

const formRef = ref();

const {
  form,
  loading,
  columns,
  dataList,
  paginations,
  onSearch,
  handleDelete,
  resetForm,
  toEdit,
  handleSizeChange,
  handleCurrentChange,
  onItemDropdownClick
} = useRole();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="文章标题" prop="module">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题"
          clearable
          class="!w-[170px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="文章列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="success"
          :icon="useRenderIcon(PlusOutlined)"
          @click="toEdit({ id: '0' })"
        >
          新增文章
        </el-button>
      </template>
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
          :pagination="{ ...paginations, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button type="info" @click="toEdit({ id: row.id })">
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除吗？"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            <el-dropdown
              placement="bottom-start"
              style="margin-left: 12px"
              @command="cmd => onItemDropdownClick(row, cmd)"
            >
              <el-button type="primary">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="setFeatured"
                    >设置推荐</el-dropdown-item
                  >
                  <el-dropdown-item command="cancelFeatured"
                    >取消推荐</el-dropdown-item
                  >
                  <el-dropdown-item command="setTop">设置置顶</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
