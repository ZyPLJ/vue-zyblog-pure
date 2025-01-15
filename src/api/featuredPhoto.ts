import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type FeaturedPhotoResult = {
  successful: boolean;
  message: string;
  statusCode: number;
  data?: any;
};

export const getFeaturedPhotoAll = () => {
  return http.request<FeaturedPhotoResult>("get", baseUrlApi("FeaturedPhoto"));
};

export const deleteFeaturedPhoto = (id: number) => {
  return http.request<FeaturedPhotoResult>(
    "delete",
    baseUrlApi(`FeaturedPhoto/${id}`)
  );
};
