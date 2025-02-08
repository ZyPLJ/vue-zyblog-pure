<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formNotice: {
    Content: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formNotice: () => ({
    Content: ""
  })
});
const newFormInline = ref(props.formNotice);
</script>
<template>
  <el-form :model="newFormInline" label-width="auto">
    <el-form-item label="内容" prop="Content">
      <el-input v-model="newFormInline.Content" class="!w-[220px]" />
    </el-form-item>
  </el-form>
</template>
