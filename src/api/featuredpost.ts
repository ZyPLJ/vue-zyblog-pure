import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type FeaturedPostResult = {
  successful: boolean;
  message: string;
  statusCode: number;
  data?: any;
};

export const getAll = () => {
  return http.request<FeaturedPostResult>("get", baseUrlApi("FeaturedPost"));
};

export const updateSort = (id: number, sort: number) => {
  return http.request<FeaturedPostResult>(
    "put",
    baseUrlApi(`FeaturedPost/${id}/${sort}`)
  );
};
