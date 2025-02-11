# 生产阶段
FROM nginx:stable-alpine as production-stage

# 复制构建结果到 Nginx
COPY dist/  /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 8031

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
