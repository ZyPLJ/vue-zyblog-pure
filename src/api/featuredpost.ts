import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type FeaturedPostPageResult = {
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

export type FeaturedPostResult = {
  successful: boolean;
  message: string;
  statusCode: number;
  data?: any;
};

export const getAll = () => {
  return http.request<FeaturedPostPageResult>(
    "get",
    baseUrlApi("FeaturedPost")
  );
};

export const updateSort = (id: number, sort: number) => {
  return http.request<FeaturedPostResult>(
    "put",
    baseUrlApi(`FeaturedPost/${id}/${sort}`)
  );
};

export const deleteFeaturedPost = (id: number) => {
  return http.request<FeaturedPostResult>(
    "delete",
    baseUrlApi(`FeaturedPost/${id}`)
  );
};
