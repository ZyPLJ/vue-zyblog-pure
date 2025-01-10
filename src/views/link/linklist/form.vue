<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formLink: {
    Name: string;
    Description: string;
    Url: string;
    favicon: string;
    visible: boolean;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formLink: () => ({
    Name: "",
    Description: "",
    Url: "",
    favicon: "",
    visible: false
  })
});
const newFormInline = ref(props.formLink);
const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>
<template>
  <el-form ref="ruleFormRef" :model="newFormInline">
    <el-form-item
      label="网站名称"
      prop="Name"
      :rules="[{ required: true, message: '网站名称不能为空' }]"
    >
      <el-input
        v-model="newFormInline.Name"
        class="!w-[220px]"
        placeholder="请输入标网站名称"
      />
    </el-form-item>
    <el-form-item
      label="网站地址"
      prop="Url"
      :rules="[{ required: true, message: '网站地址不能为空' }]"
    >
      <el-input
        v-model="newFormInline.Url"
        class="!w-[220px]"
        placeholder="请输入标网站地址"
      />
    </el-form-item>
    <el-form-item
      label="网站图标"
      prop="favicon"
      :rules="[{ required: true, message: '网站图标不能为空' }]"
    >
      <el-input
        v-model="newFormInline.favicon"
        class="!w-[220px]"
        placeholder="请输入标网站图标地址"
      />
    </el-form-item>
    <el-form-item label="网站描述" style="margin-left: 10px">
      <el-input
        v-model="newFormInline.Description"
        class="!w-[220px]"
        placeholder="请输入标网站描述"
      />
    </el-form-item>
    <el-form-item label="是否显示" style="margin-left: 10px">
      <el-switch v-model="newFormInline.visible" />
    </el-form-item>
  </el-form>
</template>
