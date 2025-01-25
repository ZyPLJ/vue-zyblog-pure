<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formConfig: {
    key: string;
    value: string;
    description: string;
    isShowComment: boolean;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formConfig: () => ({
    key: "",
    value: "",
    description: "",
    isShowComment: false
  })
});
const newFormInline = ref(props.formConfig);
</script>
<template>
  <el-form :model="newFormInline" label-width="auto">
    <el-form-item label="key" prop="key">
      <el-input v-model="newFormInline.key" class="!w-[220px]" />
    </el-form-item>
    <el-form-item label="value" prop="value">
      <el-input v-model="newFormInline.value" class="!w-[220px]" />
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-input v-model="newFormInline.description" class="!w-[220px]" />
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-switch v-model="newFormInline.isShowComment" />
    </el-form-item>
  </el-form>
</template>
