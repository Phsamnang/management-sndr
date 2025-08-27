import { http } from "@/app/utils/http";

const ServiceId = {
  TABLE: "/table",
  TYPE_TABLE:"/table/type"
} as const;

const getAllTables = async () => {
  const response = await http.get(ServiceId.TABLE);
  return response.data?.data;
};

const getAllTableTypes = async () => {
  const response = await http.get(`${ServiceId.TABLE}/type`);
  return response.data?.data;
};

const createTypeTable=async(data:any)=>{
  const rs=await http.post(ServiceId.TYPE_TABLE,data);
  return rs.data?.data;
}

const createTable = async (data: any) => {
  const rs = await http.post(ServiceId.TABLE, data);
  return rs.data?.data;
};

const updateTable = async (data: any,id:string) => {
  const rs = await http.put(`${ServiceId.TABLE}/${id}`, data);
  return rs.data?.data;
};

export const tableService = {
  getAllTables,
  getAllTableTypes,
  createTypeTable,
  createTable,
  updateTable,
};
