import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type MessageResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type MessagePageResult = {
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

export const getList = (params?: object) => {
  return http.request<MessagePageResult>(
    "get",
    baseUrlApi("MsgBoard/GetPageList"),
    { params }
  );
};

export const deleteMsg = (id: number) => {
  return http.request<MessageResult>("delete", baseUrlApi(`MsgBoard/${id}`));
};

export const deleteMsgReply = (id: number) => {
  return http.request<MessageResult>(
    "delete",
    baseUrlApi(`MsgBoard/DelMessageReply/${id}`)
  );
};
