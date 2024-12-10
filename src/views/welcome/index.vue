<script setup lang="ts">
import { chartData, onOverview, barChartData, onChartData } from "./data";
import { useDark } from "./utils";
import { ChartBar, ChartLine, ChartRound } from "./components/charts";
import { ReNormalCountTo } from "@/components/ReCountTo";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { ref, onMounted } from "vue";

import ReCol from "@/components/ReCol";

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();

let curWeek = ref(1); // 0上周、1本周
const optionsBasis: Array<OptionsType> = [
  {
    label: "上周"
  },
  {
    label: "本周"
  }
];

const chart = ref<any[]>(chartData); // 初始化为从外部导入的chartData
const barChart = ref<any[]>(barChartData);

onMounted(async () => {
  await onOverview(); // 获取数据
  await onChartData();
  chart.value = chartData; // 更新chartData
  barChart.value = barChartData;
  console.log(barChart.value[0].requireData);
});
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chart"
        :key="index"
        class="mb-[18px]"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 80 * (index + 1) } }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="`background-color: ${isDark ? 'transparent' : item.bgColor}`"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'1.6em'"
                :startVal="100"
                :endVal="item.value"
              />
              <p class="font-medium text-green-500">{{ item.percent }}</p>
            </div>
            <ChartLine
              v-if="item.data.length > 1"
              class="!w-1/2"
              :color="item.color"
              :data="item.data"
            />
            <ChartRound v-else class="!w-1/2" />
          </div>
        </el-card>
      </re-col>
      <re-col
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">访客分析</span>
            <Segmented v-model="curWeek" :options="optionsBasis" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBar :requireData="barChart[curWeek].requireData" />
          </div>
        </el-card>
      </re-col>
      <re-col
        v-motion
        class="mb-[18px]"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 480
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">开始创作</span>
          </div>
          <ul>
            <li>
              <el-button color="#626aef" :dark="isDark" style="width: 100%">
                博客文章
              </el-button>
            </li>
            <li>
              <el-button color="#626aef" :dark="isDark" style="width: 100%">
                文章分类
              </el-button>
            </li>
            <li>
              <el-button color="#626aef" :dark="isDark" style="width: 100%">
                图片上传
              </el-button>
            </li>
            <li>
              <el-button color="#626aef" :dark="isDark" style="width: 100%">
                评论管理
              </el-button>
            </li>
          </ul>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
ul {
  margin-top: 10px;
}

ul li {
  margin-bottom: 10px;
}
</style>
