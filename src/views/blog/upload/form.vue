<script lang="ts" setup>
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { createFormData } from "@pureadmin/utils";

import UploadIcon from "@iconify-icons/ri/upload-2-line";

const formRef = ref();
const uploadRef = ref();
const form = ref();
const categories = ref([]);
const Tag = ref([]);
const currentCategoryId = ref(0);
form.value = {
  Categoryname: null,
  Parent: null,
  file: null,
  Tag: null,
  publishTime: null
};

const submitForm = formEl => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
    } else {
      return false;
    }
  });
};

const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleCategoryChange = (selectedCategoryName: string) => {
  const selectedItem = categories.value.find(
    item => item.name === selectedCategoryName
  );

  currentCategoryId.value = selectedItem.id;
  form.value.Categoryname = selectedCategoryName;
};

const handleCategoryChangeParent = (selectedCategoryName: string) => {
  form.value.Parent = selectedCategoryName;
};

const handleTag = (selectedTagName: string) => {
  form.value.Tag = selectedTagName;
};
</script>

<template>
  <el-form ref="formRef" :model="form" label-width="82px">
    <el-form-item
      label="附件"
      prop="fileList"
      :rules="[{ required: true, message: '附件不能为空' }]"
    >
      <el-upload
        ref="uploadRef"
        v-model:file-list="form.fileList"
        drag
        multiple
        action="#"
        class="!w-[200px]"
        :auto-upload="false"
      >
        <div class="el-upload__text">
          <IconifyIconOffline
            :icon="UploadIcon"
            width="26"
            class="m-auto mb-2"
          />
          可点击或拖拽上传
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item
      label="定时发布"
      :rules="[{ required: true, message: '日期不能为空' }]"
    >
      <el-date-picker
        v-model="form.publishTime"
        type="datetime"
        class="!w-[200px]"
        placeholder="请选择日期时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item
      label="文章分类"
      prop="categoryId"
      :rules="[{ required: true, message: '分类不能为空' }]"
    >
      <el-select
        v-model="form.Categoryname"
        filterable
        allow-create
        default-first-option
        placeholder="请选择分类"
        :reserve-keyword="false"
        v-on:change="handleCategoryChange"
      >
        <template v-for="item in categories">
          <el-option
            v-if="item.parentId == 0"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        v-model="form.ParentId"
        filterable
        allow-create
        default-first-option
        placeholder="请选择分类"
        :reserve-keyword="false"
        v-on:change="handleCategoryChangeParent"
      >
        <template v-for="item in categories">
          <el-option
            v-if="item.parentId !== 0 && item.parentId == currentCategoryId"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="文章标签">
      <el-select
        v-model="form.Tag"
        multiple
        placeholder="请选择标签"
        style="width: 240px"
        v-on:change="handleTag"
      >
        <el-option
          v-for="item in Tag"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" text bg @click="submitForm(formRef)">
        提交
      </el-button>
      <el-button text bg @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
