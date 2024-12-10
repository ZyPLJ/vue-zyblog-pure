import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type VisitRecord = {
  successful: boolean;
  data: {
    name: string;
    value: number;
    percent: string;
    data: any[];
  };
};

export const getOverview = (params?: object) => {
  return http.request<VisitRecord>(
    "get",
    baseUrlApi("VisitRecord/OverviewNew"),
    { params }
  );
};
