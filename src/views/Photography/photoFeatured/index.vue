<script setup lang="ts">
import { ref } from "vue";
import { getFeaturedPhotoAll, deleteFeaturedPhoto } from "@/api/featuredPhoto";
import { getAll as gethost } from "@/api/config";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import deleteBackFill from "@iconify-icons/ri/close-fill";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

defineOptions({
  name: "photoFeatured"
});
const featuredPhotos = ref([]);
const host = ref([]);

const loadData = () => {
  gethost()
    .then(res => (host.value = res.data))
    .catch(res =>
      message(`获取配置列表出错：${res.message}`, { type: "error" })
    );
  getFeaturedPhotoAll().then(res => {
    featuredPhotos.value = res.data;
    featuredPhotos.value.forEach(item => {
      item.photo.url =
        host.value[0]?.value + `/media/photofraphy/${item.photo.id}.jpg`;
      let dt = new Date(item.photo.createTime);
      item.photo.dateTimeStr = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
    });
  });
};
const dItem = (row: any) => {
  ElMessageBox.confirm("此操作将删除这个推荐图片, 是否继续?", "提示", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning"
  })
    .then(() => {
      deleteFeaturedPhoto(row.id)
        .then(res => message(`删除成功。${res.message}`, { type: "success" }))
        .catch(res => message(`操作失败。${res.message}`, { type: "error" }))
        .finally(() => loadData());
    })
    .catch(() => message("已取消删除"));
};

loadData();
</script>
<template>
  <el-main>
    <el-row v-if="featuredPhotos.length > 0" :gutter="10">
      <el-col v-for="fp in featuredPhotos" :key="fp.id" :span="4">
        <el-card :body-style="{ padding: '0px' }">
          <el-image
            :src="fp.photo.url"
            class="image"
            :preview-src-list="[fp.photo.url]"
          />
          <div style="padding: 14px">
            <div>图片标题：{{ fp.photo.title }}</div>
            <div>拍摄地点：{{ fp.photo.location }}</div>
            <div style="margin-top: 3px">
              <time class="time">{{ fp.photo.dateTimeStr }}</time>
            </div>
            <div class="bottom clearfix" style="margin: 3px">
              <el-button-group>
                <el-button
                  type="danger"
                  :icon="useRenderIcon(deleteBackFill)"
                  @click="dItem(fp)"
                />
              </el-button-group>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-else description="推荐图片" />
  </el-main>
</template>
