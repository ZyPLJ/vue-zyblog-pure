import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type TagResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export const getAllTags = () => {
  return http.request<TagResult>("get", baseUrlApi("Tag/All"));
};
