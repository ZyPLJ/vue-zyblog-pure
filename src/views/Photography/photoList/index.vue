<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import PhotoCard from "./PhotoCard.vue";
import { addPhoto as add, getPhotosPage } from "@/api/photo";
import { getAll } from "@/api/config";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { addDialog } from "@/components/ReDialog/index";
import forms, { type FormProps } from "@/views/Photography/photoList/form.vue";

defineOptions({
  name: "photoList"
});
const paginations = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1
});
const photos = ref([]);
const host = ref([]);
const formRef = ref();
const fileList = ref([]);

const loadPhotos = async () => {
  try {
    // 获取所有的配置
    const { data: allRes } = await getAll();
    host.value = allRes;

    // 获取当前页的照片
    const { data, pagination } = await getPhotosPage(paginations);
    paginations.total = pagination.totalItemCount;
    paginations.pageSize = pagination.pageSize;
    paginations.currentPage = pagination.pageNumber;
    photos.value = data.map(item => ({
      ...item,
      // 这是后台项目的路径
      url: host.value[0]?.value + "/media/" + item.yPath
    }));
  } catch (error) {
    // 处理错误
    message(`获取配置列表出错：${error.message}`, { type: "error" });
  }
};
const handlePageSizeChange = (pageSize: number) => {
  paginations.pageSize = pageSize;
  loadPhotos();
};
const handleCurrentPageChange = (page: number) => {
  paginations.currentPage = page;
  loadPhotos();
};

const ShowDlog = () => {
  addDialog({
    width: "30%",
    title: "上传照片",
    props: {
      // 赋默认值
      formPhoto: {
        title: "",
        location: "",
        fileList: [],
        file: null
      }
    },
    contentRenderer: () => h(forms, { ref: formRef, formPhoto: null }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      const { formPhoto } = options.props as FormProps;
      FormRef.validate(valid => {
        if (valid) {
          add(formPhoto.title, formPhoto.location, formPhoto.file.raw)
            .then(res => {
              done(); // 关闭弹框
              loadPhotos();
              if (res.successful) {
                message("图片上传成功", { type: "success" });
                fileList.value = [];
              }
            })
            .catch(() => {
              message("图片上传失败", { type: "error" });
            });
        }
      });
    }
  });
};

onMounted(() => {
  loadPhotos();
});
</script>
<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
        <div>
          <el-button :icon="useRenderIcon(AddFill)" @click="ShowDlog">
            添加
          </el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <Waterfall
        :list="photos"
        :breakpoints="{
          1200: { rowPerView: 4 },
          800: { rowPerView: 3 },
          500: { rowPerView: 2 }
        }"
        :crossOrigin="false"
      >
        <template #default="{ item }">
          <div class="card">
            <LazyImg
              :url="item.url"
              :height="item.height"
              :width="item.width"
            />
            <PhotoCard :photo="item" v-on:onItemDeleted="loadPhotos" />
          </div>
        </template>
      </Waterfall>
    </el-main>
    <el-footer>
      <el-footer height="30px">
        <!-- 分页 -->
        <el-pagination
          class="float-right"
          background
          :total="paginations.total"
          :current-page="paginations.currentPage"
          :page-sizes="[10, 20, 40, 60, 80, 100]"
          :page-size="paginations.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </el-footer>
    </el-footer>
  </el-container>
</template>
