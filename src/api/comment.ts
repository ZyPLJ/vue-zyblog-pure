import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type CommentResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type CommentPageResult = {
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

export const getCommentList = (params?: object) => {
  return http.request<CommentPageResult>("get", baseUrlApi("Comment"), {
    params
  });
};

export const deleteComment = (itemId?: number) => {
  return http.request<CommentResult>("delete", baseUrlApi(`Comment/${itemId}`));
};

export const RangeDeleteComment = (params?: object) => {
  return http.request<CommentResult>(
    "delete",
    baseUrlApi("Comment/RangeDelComment"),
    { params }
  );
};
