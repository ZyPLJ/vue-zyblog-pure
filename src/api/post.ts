import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import { createFormData } from "@pureadmin/utils";

export type PostPageResult = {
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

export type PostResult = {
  successful: boolean;
  message: string;
  statusCode: number;
  data?: any;
};

export const getPostList = (params?: object) => {
  return http.request<PostPageResult>("get", baseUrlApi("BlogPost"), {
    params
  });
};

export const getPost = (id: string) => {
  return http.request<PostResult>("get", baseUrlApi(`BlogPost/${id}`));
};

export const deletePost = (id: string) => {
  return http.request<PostResult>("delete", baseUrlApi(`BlogPost/${id}`));
};

export const uploadImage = (id: string, file: any) => {
  const formData = createFormData({
    file: file // file 文件
  });
  console.log(formData);
  return http.request<PostResult>(
    "post",
    baseUrlApi(`BlogPost/${id}/UploadImage`),
    { data: formData },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

export const add = (data: any) => {
  return http.request<PostResult>("post", baseUrlApi("BlogPost"), { data });
};

export const update = (id: string, data: any) => {
  return http.request<PostResult>("put", baseUrlApi(`BlogPost/${id}`), {
    data
  });
};

export const setFeatured = (id: string) => {
  return http.request<PostResult>(
    "post",
    baseUrlApi(`BlogPost/${id}/SetFeatured`)
  );
};

export const cancelFeatured = (id: string) => {
  return http.request<PostResult>(
    "post",
    baseUrlApi(`BlogPost/${id}/CancelFeatured`)
  );
};

export const setTop = (id: string) => {
  return http.request<PostResult>("post", baseUrlApi(`BlogPost/${id}/SetTop`));
};

export const upload = (
  Categoryname: string,
  parentId: string,
  tags: string[],
  publishTime: string,
  file: any
) => {
  const formData = new FormData();
  formData.append("Categoryname", Categoryname);
  formData.append("Parent", parentId);
  tags.forEach((tag: string) => {
    formData.append("tags[]", tag);
  });
  formData.append("publishTime", publishTime);
  formData.append("file", file);

  return http.request<PostResult>(
    "post",
    baseUrlApi(`Blog/Upload`),
    { data: formData },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
