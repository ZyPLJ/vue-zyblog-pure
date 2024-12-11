export default {
  path: "/blog",
  meta: {
    icon: "ep:menu",
    title: "博客"
  },
  children: [
    {
      path: "/blog/post/index",
      name: "post",
      component: () => import("@/views/blog/post/index.vue"),
      meta: {
        title: "文章列表"
      }
    },
    {
      path: "/blog/category/index",
      name: "category",
      component: () => import("@/views/blog/category/index.vue"),
      meta: {
        title: "文章分类"
      }
    },
    {
      path: "/blog/post/editPost/:id",
      name: "edit",
      component: () => import("@/views/blog/post/editPost.vue"),
      meta: {
        showLink: false
      }
    }
  ]
};
