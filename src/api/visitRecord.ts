import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type VisitRecord = {
  name: string;
  value: number;
  percent: string;
  data: any[];
};
export type OverviewResult = {
  successful: boolean;
  data: VisitRecord[];
};
export type VisitChart = {
  requireData: any[];
};
export type VisitChartResult = {
  successful: boolean;
  data: VisitChart[];
};

export const getOverview = (params?: object) => {
  return http.request<OverviewResult>(
    "get",
    baseUrlApi("VisitRecord/OverviewNew"),
    { params }
  );
};

export const getVisitChart = (params?: object) => {
  return http.request<VisitChartResult>(
    "get",
    baseUrlApi("VisitRecord/ChatDate"),
    { params }
  );
};
