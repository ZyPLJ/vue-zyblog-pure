import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type TagResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type TagPageResult = {
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

export const getAllTags = () => {
  return http.request<TagResult>("get", baseUrlApi("Tag/All"));
};

export const getTagList = (params?: object) => {
  return http.request<TagPageResult>("get", baseUrlApi("Tag/GetPage"), {
    params
  });
};

export const delTag = (id: number) => {
  return http.request<TagResult>("delete", baseUrlApi(`Tag/${id}`));
};

export const addTag = (data: object) => {
  return http.request<TagResult>("post", baseUrlApi("Tag"), { data });
};

export const updateTag = (data: object) => {
  return http.request<TagResult>("put", baseUrlApi("Tag"), { data });
};
