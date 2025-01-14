<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formExchangeLink: {
    id: string;
    action: string;
    reason: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formExchangeLink: () => ({
    id: "",
    action: "",
    reason: ""
  })
});
const newFormInline = ref(props.formExchangeLink);
</script>
<template>
  <el-form :model="newFormInline" label-width="auto">
    <el-form-item label="id" prop="id">
      <el-input v-model="newFormInline.id" class="!w-[220px]" disabled />
    </el-form-item>
    <el-form-item label="action" prop="action">
      <el-input v-model="newFormInline.action" class="!w-[220px]" disabled />
    </el-form-item>
    <el-form-item label="理由" prop="reason">
      <el-input
        v-model="newFormInline.reason"
        class="!w-[220px]"
        placeholder="请输入标网站图标地址"
      />
    </el-form-item>
  </el-form>
</template>
