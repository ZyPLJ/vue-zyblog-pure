<script lang="ts" setup>
import { ref } from "vue";
import { getAll } from "@/api/categroy";
import { upload } from "@/api/post";
import { getAllTags } from "@/api/tag";
import { message } from "@/utils/message";
import formatTime from "@/utils/dateTime";
import { useRouter } from "vue-router";

import UploadIcon from "@iconify-icons/ri/upload-2-line";

const formRef = ref();
const form = ref();
const fileList = ref([]);
const categories = ref([]);
const Tag = ref([]);
const currentCategoryId = ref(0);
const router = useRouter();
form.value = {
  Categoryname: null,
  Parent: null,
  file: null,
  Tag: [],
  publishTime: null
};

const loadCategories = async () => {
  const res = await getAll();
  categories.value = res.data;
};

const loadTags = async () => {
  const res = await getAllTags();
  Tag.value = res.data;
};

const submitForm = formEl => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    const format = "yyyy-MM-dd HH:mm:ss";
    form.value.publishTime = formatTime(form.value.publishTime, format);
    upload(
      form.value.Categoryname,
      form.value.Parent,
      form.value.Tag,
      form.value.publishTime,
      form.value.file.raw
    )
      .then(res => {
        if (res.successful) {
          message("上传文章成功", { type: "success" });
          router.push({ name: "post" });
        } else {
          message("上传文章失败", { type: "error" });
        }
      })
      .catch(error => {
        message("上传过程中发生错误", { type: "error" });
      });
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

const onUploadChange = (file: any, list: any) => {
  const isIMAGE = file.raw.type === "application/x-zip-compressed";
  if (!isIMAGE) {
    message("只能上传zip压缩包!");
    fileList.value = [];
    return false;
  }
  // 只保留最新上传的文件
  if (list.length > 0) {
    fileList.value = [file]; // 保留当前有效文件
  }

  form.value.file = file;
};

loadCategories();
loadTags();
</script>

<template>
  <el-form ref="formRef" :model="form" label-width="82px">
    <el-form-item
      label="附件"
      prop="file"
      :rules="[{ required: true, message: '附件不能为空' }]"
    >
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        drag
        action=""
        class="!w-[200px]"
        :auto-upload="false"
        accept="application/x-zip-compressed,.zip"
        :on-change="onUploadChange"
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
      label="文章分类"
      prop="Categoryname"
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
    <el-form-item label="定时发布">
      <el-date-picker
        v-model="form.publishTime"
        type="datetime"
        class="!w-[200px]"
        placeholder="请选择日期时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" text bg @click="submitForm(formRef)">
        提交
      </el-button>
      <el-button text bg @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
