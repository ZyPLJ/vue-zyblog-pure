import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import { getOverview, getVisitChart } from "@/api/visitRecord";

let chartData = [];
let barChartData = [];
async function onOverview() {
  try {
    let result = await getOverview();
    if (result.successful) {
      chartData = result.data.map(item => ({
        icon: getIconForName(item.name), // 根据名称获取对应的图标，如果没有可以直接设置为 null 或默认图标
        bgColor: getBackgroundColorForName(item.name), // 根据名称获取背景颜色，类似于图标
        color: getColorForName(item.name), // 根据名称获取图表颜色
        duration: 2200, // 这个属性可以根据需求调整
        name: item.name,
        value: item.value,
        percent: "+" + item.percent,
        data: item.data // 数据数组直接使用
      }));
    }
  } catch (error) {
    console.log(error);
  }
}
async function onChartData() {
  try {
    let result = await getVisitChart();
    if (result.successful) {
      barChartData = result.data.map(item => ({
        requireData: item.requireData
      }));
      console.log(barChartData);
    }
  } catch (error) {
    console.log(error);
  }
}
// 根据名称返回对应的图标 (示例)
function getIconForName(name: string) {
  switch (name) {
    case "阅读总量":
      return CheckLine;
    case "文章数量":
      return Smile;
    case "评论数量":
      return Question;
    case "访问总量":
      return GroupLine; // 或者使用其他图标
    default:
      return null; // 如果没有匹配的图标，则返回null
  }
}

// 这里可以定义背景颜色和字体颜色的映射
function getBackgroundColorForName(name: string) {
  switch (name) {
    case "阅读总量":
      return "#effaff";
    case "文章数量":
      return "#fff5f4";
    case "评论数量":
      return "#f6f4fe";
    case "访问总量":
      return "#eff8f4";
    default:
      return "#ffffff"; // 默认颜色
  }
}

function getColorForName(name: string) {
  switch (name) {
    case "阅读总量":
      return "#41b6ff";
    case "文章数量":
      return "#e85f33";
    case "评论数量":
      return "#7846e5";
    case "访问总量":
      return "#26ce83";
    default:
      return "#000000"; // 默认颜色
  }
}

export { chartData, onOverview, barChartData, onChartData };
