import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type PhotoResult = {
  successful: boolean;
  message: string;
  data?: Array<any>;
};

export type PhotoPageResult = {
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

export const getPhotosPage = (params?: object) => {
  return http.request<PhotoPageResult>("get", baseUrlApi("Photo"), { params });
};

export const getPhoto = (id: number) => {
  return http.request<PhotoResult>("get", baseUrlApi(`Photo/${id}`));
};

export const addPhoto = (title: string, location: string, file: any) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("location", location);
  formData.append("file", file);
  return http.request<PhotoResult>("post", baseUrlApi("Photo"), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deletePhoto = (id: number) => {
  return http.request<PhotoResult>("delete", baseUrlApi(`Photo/${id}`));
};

export const setFeaturedPhoto = (id: number) => {
  return http.request<PhotoResult>(
    "post",
    baseUrlApi(`Photo/${id}/setFeatured`)
  );
};

export const cancelFeaturedPhoto = (id: number) => {
  return http.request<PhotoResult>(
    "post",
    baseUrlApi(`Photo/${id}/cancelFeatured`)
  );
};
