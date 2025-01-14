import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type LinkExchangeResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type LinkExchangePageResult = {
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

export const getAllLinkExchange = () => {
  return http.request<LinkExchangeResult>("get", baseUrlApi("LinkExchange"));
};

export const getLinkExchangePage = (params?: object) => {
  return http.request<LinkExchangePageResult>(
    "post",
    baseUrlApi("LinkExchange/GetPagedList"),
    {
      params
    }
  );
};

export const getLinkExchangeById = (id: number) => {
  return http.request<LinkExchangeResult>(
    "get",
    baseUrlApi(`LinkExchange/${id}`)
  );
};

export const addLinkExchange = (params?: object) => {
  return http.request<LinkExchangeResult>("post", baseUrlApi("LinkExchange"), {
    params
  });
};

export const updateLinkExchange = (id: number, params?: object) => {
  return http.request<LinkExchangeResult>(
    "put",
    baseUrlApi(`LinkExchange/${id}`),
    {
      params
    }
  );
};

export const deleteLinkExchange = (id: number) => {
  return http.request<LinkExchangeResult>(
    "delete",
    baseUrlApi(`LinkExchange/${id}`)
  );
};

export const acceptLinkExchange = (id: number, data: any) => {
  return http.request<LinkExchangeResult>(
    "post",
    baseUrlApi(`LinkExchange/${id}/Accept`),
    {
      data
    }
  );
};

export const rejectLinkExchange = (id: number, data: any) => {
  return http.request<LinkExchangeResult>(
    "post",
    baseUrlApi(`LinkExchange/${id}/Reject`),
    {
      data
    }
  );
};
