<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formCategory: {
    name: string;
    description: string;
    iconCssClass: string;
  };
}
const props = withDefaults(defineProps<FormProps>(), {
  formCategory: () => ({ name: "", description: "", iconCssClass: "" })
});
const newFormInline = ref(props.formCategory);
</script>

<template>
  <el-form :model="newFormInline">
    <el-form-item label="名称">
      <el-input
        v-model="newFormInline.name"
        class="!w-[220px]"
        placeholder="请输入分类名称"
      />
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="newFormInline.description"
        class="!w-[220px]"
        placeholder="请输入分类描述"
      />
    </el-form-item>
    <el-form-item label="图标">
      <el-input
        v-model="newFormInline.iconCssClass"
        class="!w-[220px]"
        placeholder="请输入图标类名"
      />
    </el-form-item>
  </el-form>
</template>
