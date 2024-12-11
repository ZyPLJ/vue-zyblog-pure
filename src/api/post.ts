import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type PostPageResult = {
  pagination: {
    pageCount: number;
    totalItemCount: number;
    pageNumber: number;
    pageSize: number;
  };
  successful: boolean;
  message: string;
  statusCode: number;
  data?: Array<any>;
};

export type PostResult = {
  successful: boolean;
  message: string;
  statusCode: number;
  data?: any;
};

export const getPostList = (params?: object) => {
  return http.request<PostPageResult>("get", baseUrlApi("BlogPost"), {
    params
  });
};

export const deletePost = (id: string) => {
  return http.request<PostResult>("delete", baseUrlApi(`BlogPost/${id}`));
};
