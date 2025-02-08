import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type NoticeResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export const getNotice = () => {
  return http.request<NoticeResult>("get", baseUrlApi("Notice/Get"));
};

export const addNotice = (params?: string) => {
  return http.request<NoticeResult>(
    "get",
    baseUrlApi("Notice?Content=" + params)
  );
};

export const deleteNotice = (itemId?: number) => {
  return http.request<NoticeResult>("delete", baseUrlApi(`Notice/${itemId}`));
};
