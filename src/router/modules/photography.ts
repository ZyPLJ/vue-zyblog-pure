export default {
  path: "/Photography",
  redirect: "/Photography/photoList/index",
  meta: {
    icon: "ep:camera-filled",
    title: "摄影管理"
  },
  children: [
    {
      path: "/Photography/photoList/index",
      name: "photoList",
      component: () => import("@/views/Photography/photoList/index.vue"),
      meta: {
        title: "图片列表"
      }
    },
    {
      path: "/Photography/photoFeatured/index",
      name: "photoFeatured",
      component: () => import("@/views/Photography/photoFeatured/index.vue"),
      meta: {
        title: "精选图片"
      }
    }
  ]
};
