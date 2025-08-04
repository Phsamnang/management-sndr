import { http } from "@/app/utils/http";

const ServiceId = {
  TABLE: "/table",
  TYPE_TABLE:"/table/type"
} as const;

const getAllTables = async () => {
  const response = await http.get(ServiceId.TABLE);
  return response.data;
};

const getAllTableTypes = async () => {
  const response = await http.get(`${ServiceId.TABLE}/type`);
  return response.data;
};

const createTypeTable=async(data:any)=>{
  const rs=await http.post(ServiceId.TYPE_TABLE,data);
  return rs.data;
}

const createTable = async (data: any) => {
  const rs = await http.post(ServiceId.TABLE, data);
  return rs.data;
};

export const tableService = {
  getAllTables,
  getAllTableTypes,
  createTypeTable,
  createTable
};
