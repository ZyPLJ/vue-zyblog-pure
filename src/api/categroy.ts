import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type CategoryResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type CategoryPageResult = {
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
export const getCategoryList = (params?: object) => {
  return http.request<CategoryPageResult>(
    "get",
    baseUrlApi("Category/GetPageCategories"),
    { params }
  );
};
export const setFeatured = (itemId?: number, data?: object) => {
  return http.request<CategoryResult>(
    "post",
    baseUrlApi(`Category/${itemId}/SetFeatured`),
    { data }
  );
};
export const CancelFeatured = (itemId?: number) => {
  return http.request<CategoryResult>(
    "post",
    baseUrlApi(`Category/${itemId}/CancelFeatured`)
  );
};
export const deleteCategory = (itemId?: number) => {
  return http.request<CategoryResult>(
    "delete",
    baseUrlApi(`Category/${itemId}`)
  );
};

export const updateCategory = (itemId?: number, data?: object) => {
  return http.request<CategoryResult>("put", baseUrlApi(`Category/${itemId}`), {
    data
  });
};

export const setVisible = (itemId?: number) => {
  return http.request<CategoryResult>(
    "post",
    baseUrlApi(`Category/${itemId}/SetVisible`)
  );
};

export const setInvisible = (itemId?: number) => {
  return http.request<CategoryResult>(
    "post",
    baseUrlApi(`Category/${itemId}/SetInvisible`)
  );
};
