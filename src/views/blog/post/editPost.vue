<script setup lang="ts">
import { ref, computed } from "vue";
import { useRole } from "./hook";
import { ElNotification, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { getPost, uploadImage, add, update } from "@/api/post";
import { getAll } from "@/api/categroy";
import { getAllTags } from "@/api/tag";
import { useRouter } from "vue-router";
import { getNodeByUniqueId } from "@/utils/tree";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

const router = useRouter();
const { initToDetail, getParameter } = useRole();
initToDetail();

//文章编辑模式 new/edit
const mode = ref("new");
const postContent = ref("");
//文章标题
const postTitle = ref("");
//下拉框选择的文章分类名称
const postCategoryName = ref("");
//下拉框选择的文章标签
const postTag = ref([]);
//文章分类列表
const categories = ref([]);
//文章分类ID
const postCategoryId = ref(null);
//文章摘要
const postSummary = ref("");
//文章标签列表
const Tag = ref([]);
const post = ref(null);

//初始化
const init = async () => {
  let id = getParameter.id;
  const { data } = await getAll();
  categories.value = data;
  const { data: tagData } = await getAllTags();
  Tag.value = tagData;
  if (id !== "0") {
    mode.value = "edit";
    const { data } = await getPost(id as string);
    post.value = data;
    postTitle.value = post.value.title;
    postContent.value = post.value.content;
    postSummary.value = post.value.summary;
    postCategoryId.value = post.value.categoryId;
    postCategoryName.value = post.value.categories.name;
    postTag.value = post.value.postTags.map(({ tagId }) => tagId);
    //获取文章详情
    ElNotification.success({
      title: "当前模式：修改文章",
      message: `加载文章：${postTitle.value}`,
      showClose: false
    });
  } else {
    mode.value = "new";
    post.value = {};
    ElNotification.warning({
      title: "当前模式：新建文章",
      message: "注意：只有保存文章之后才能上传图片！",
      showClose: false
    });
  }
};
//编辑简介
const onSummaryClick = () => {
  ElMessageBox.prompt("请输入文章简介", "提示", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    inputValue: postSummary.value
  })
    .then(({ value }) => {
      postSummary.value = value;
      message(`编辑简介成功：${value}`, { type: "success" });
    })
    .catch(() => {
      message("取消输入", { type: "info" });
    });
};
/**
 * 上传图片处理
 * @param event
 * @param insertImage Function
 * @param files
 */
const handleUploadImage = (event: any, insertImage: Function, files: any) => {
  let file = files[0];
  console.log(file);
  uploadImage(post.value.id, file)
    .then(res => {
      message(`上传图片成功：${res.data.imgName}`, { type: "success" });
      insertImage({
        url: res.data.imgUrl.replaceAll("\\", "/"),
        desc: res.data.imgName
      });
    })
    .catch(res =>
      message(`上传图片失败：${res.data.message}`, { type: "error" })
    );
};
const categoryChange = categoryId => {
  postCategoryId.value = categoryId;
};
//保存文章
const save = async () => {
  try {
    const tags = postTag.value.map(tagId => {
      const tag = Tag.value.find(t => t.id === tagId);
      return tag ? { id: tag.id, name: tag.name } : null;
    });
    let p = post.value;
    p.title = postTitle.value;
    p.content = postContent.value;
    p.summary = postSummary.value;
    p.categoryId = postCategoryId.value;
    p.tags = tags;
    if (mode.value === "new") {
      const res = await add(p);
      if (res.successful) {
        message(`新建文章成功：${p.title}`, { type: "success" });
        backToList();
      } else {
        message(`新建文章失败：${res.message}`, { type: "error" });
      }
    } else {
      const res = await update(getParameter.id as string, p);
      if (res.successful) {
        message(`修改文章成功：${p.title}`, { type: "success" });
      } else {
        message(`修改文章失败：${res.message}`, { type: "error" });
      }
    }
  } catch (error) {
    message(`保存文章失败：${error.message}`, { type: "error" });
  }
};
//关闭当前页面并返回列表页面
const multiTags = computed(() => {
  return useMultiTagsStoreHook()?.multiTags;
});

const backToList = () => {
  useMultiTagsStoreHook().handleTags("splice", "/blog/post/editPost/:id");
  router.push({ name: "post" });
};
init();
</script>

<template>
  <el-card>
    <el-container>
      <el-header height="30px">
        <el-row :gutter="6">
          <el-col :span="3">
            <el-select
              v-model="postCategoryName"
              filterable
              placeholder="请选择分类"
              v-on:change="categoryChange"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="postTag" multiple placeholder="请选择标签">
              <el-option
                v-for="item in Tag"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input v-model="postTitle" placeholder="文章标题" />
          </el-col>
          <el-col :span="1">
            <el-button
              type="warning"
              plain
              :style="'width:100%'"
              @click="onSummaryClick"
            >
              简介
            </el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" plain @click="save">保存</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <v-md-editor
          v-model="postContent"
          height="680px"
          :default-show-toc="true"
          :codemirror-style-reset="true"
          :disabled-menus="mode === 'edit' ? [] : ['image/upload-image']"
          @upload-image="handleUploadImage"
        />
      </el-main>
    </el-container>
  </el-card>
</template>
<style lang="scss" scoped>
div {
  border-width: 0 !important;
}
</style>
