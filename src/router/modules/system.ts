export default {
  path: "/System",
  redirect: "/System/visitRecord/index",
  meta: {
    icon: "ri:settings-5-fill",
    title: "系统管理"
  },
  children: [
    {
      path: "/System/visitRecord/index",
      name: "visitRecord",
      component: () => import("@/views/System/visitRecord/index.vue"),
      meta: {
        title: "访问日志"
      }
    },
    {
      path: "/System/config/index",
      name: "config",
      component: () => import("@/views/System/config/index.vue"),
      meta: {
        title: "配置管理"
      }
    },
    {
      path: "/System/Comment/index",
      name: "Comment",
      component: () => import("@/views/System/Comment/index.vue"),
      meta: {
        title: "评论管理"
      }
    },
    {
      path: "/System/Notice/index",
      name: "Notice",
      component: () => import("@/views/System/Notice/index.vue"),
      meta: {
        title: "公告管理"
      }
    }
  ]
};
