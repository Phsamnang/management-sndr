import { http } from "@/app/utils/http";

const ServiceId = {
  TABLE: "/table",
} as const;

const getAllTables = async () => {
  const response = await http.get(ServiceId.TABLE);
  return response.data;
};

const getAllTableTypes = async () => {
  const response = await http.get(`${ServiceId.TABLE}/type`);
  return response.data;
};

export const tableService = {
  getAllTables,
  getAllTableTypes,
};
