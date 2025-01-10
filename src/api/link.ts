import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type LinkResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type LinkPageResult = {
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

export const getAllLinks = () => {
  return http.request<LinkResult>("get", baseUrlApi("Link"));
};

export const getLinkPage = (params?: object) => {
  return http.request<LinkPageResult>("post", baseUrlApi("Link/GetPagedList"), {
    params
  });
};

export const deleteLink = (id: number) => {
  return http.request<LinkResult>("delete", baseUrlApi(`Link/${id}`));
};

export const addLink = (data: object) => {
  return http.request<LinkResult>("post", baseUrlApi("Link"), { data });
};

export const updateLink = (id: number, data: object) => {
  return http.request<LinkResult>("put", baseUrlApi(`Link/${id}`), { data });
};
