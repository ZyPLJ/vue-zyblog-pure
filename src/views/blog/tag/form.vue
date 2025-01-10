<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formTag: {
    TagName: string;
  };
}
const props = withDefaults(defineProps<FormProps>(), {
  formTag: () => ({ TagName: "" })
});
const newFormInline = ref(props.formTag);
</script>
<template>
  <el-form :model="newFormInline">
    <el-form-item label="名称">
      <el-input
        v-model="newFormInline.TagName"
        class="!w-[220px]"
        placeholder="请输入标签名称"
      />
    </el-form-item>
  </el-form>
</template>
