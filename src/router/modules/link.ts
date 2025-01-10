export default {
  path: "/link",
  redirect: "/link/linklist/index",
  meta: {
    icon: "ep:link",
    title: "友链管理"
  },
  children: [
    {
      path: "/link/linklist/index",
      name: "LinkList",
      component: () => import("@/views/link/linklist/index.vue"),
      meta: {
        title: "友情链接"
      }
    },
    {
      path: "/link/exchange/index",
      name: "Exchange",
      component: () => import("@/views/link/exchange/index.vue"),
      meta: {
        title: "友情申请"
      }
    }
  ]
};
