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
