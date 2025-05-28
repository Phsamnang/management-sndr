import { http } from "@/app/utils/http";

const ServiceId = {
  TABLE: "/table",
};


const getAllTable=async()=>{
    const response = await http.get(ServiceId.TABLE);
    return response.data;
}

const getAllTableTye = async () => {
  const response = await http.get(ServiceId.TABLE+'/type');
  return response.data;
};

export const tabelService={
    getAllTable,
    getAllTableTye
}