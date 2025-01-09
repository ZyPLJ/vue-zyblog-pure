<script setup lang="ts">
import UploadForm from "./form.vue";
</script>

<template>
  <el-card>
    <p class="mb-4 mt-4">
      <span class="text-[14px]">
        只能上传Zip文件，压缩包应包含markdown文件和图片文件。
      </span>
    </p>
    <div class="flex justify-between">
      <UploadForm />
    </div>
  </el-card>
</template>
