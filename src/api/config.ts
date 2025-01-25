import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type ConfigResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export const getAll = () => {
  return http.request<ConfigResult>("get", baseUrlApi("Config"));
};

export const isShow = (id: number) => {
  return http.request<ConfigResult>("get", baseUrlApi(`Config/${id}`));
};

export const addConfig = (data: any) => {
  return http.request<ConfigResult>("post", baseUrlApi("Config"), { data });
};

export const deleteConfig = (id: number) => {
  return http.request<ConfigResult>("delete", baseUrlApi(`Config/${id}`));
};
