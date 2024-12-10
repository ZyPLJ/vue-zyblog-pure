import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type CategoryResult = {
  successful: boolean;
  data?: Array<any>;
};
export const getCategoryList = (params?: object) => {
  return http.request<CategoryResult>("get", baseUrlApi("Category/All"), {
    params
  });
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
    baseUrlApi(`Category/${itemId}/SetFeatured`)
  );
};
