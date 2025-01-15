<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

export interface FormProps {
  formPhoto: {
    title: string;
    location: string;
    fileList: Array<File>;
    file: any;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formPhoto: () => ({
    title: "",
    location: "",
    fileList: [],
    file: null
  })
});
const newFormInline = ref(props.formPhoto);

const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });

const onUploadChange = (file: any, list: any) => {
  const isIMAGE =
    file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  if (!isIMAGE) {
    message("只能上传jpg/png图片!");
    newFormInline.value.fileList = [];
    return false;
  }

  if (list.length > 0) {
    newFormInline.value.fileList = [file]; // 保留当前有效文件
  }

  newFormInline.value.file = file;
};
</script>
<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="auto">
    <el-form-item
      label="图片名称"
      prop="title"
      :rules="[{ required: true, message: '图片名称不能为空' }]"
    >
      <el-input
        v-model="newFormInline.title"
        class="!w-[220px]"
        placeholder="请输入图片名称"
      />
    </el-form-item>
    <el-form-item
      label="拍摄地点"
      prop="location"
      :rules="[{ required: true, message: '拍摄地点不能为空' }]"
    >
      <el-input
        v-model="newFormInline.location"
        class="!w-[220px]"
        placeholder="请输入拍摄地点"
      />
    </el-form-item>
    <el-upload
      ref="upload"
      drag
      action=""
      accept="image/jpeg,image/png"
      :file-list="newFormInline.fileList"
      :on-change="onUploadChange"
      :auto-upload="false"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-form>
</template>
