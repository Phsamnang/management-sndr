import { http } from "@/app/utils/http"

const ServiceId = {
  IMPORT: "/import",
  IMPORT_PRODUCT: "/import/product",
};

const createImport=async(data:any)=>{
    const rs=await http.post(ServiceId.IMPORT+'/create',data);
    return rs.data;
}

const getImportByDate=async(date:string)=>{
    const rs = await http.get(ServiceId.IMPORT, {
      params: {
        importDate: date,
      },
    });
    return rs.data;
}

const updateImportPaymentStatus=async(data:any)=>{
  const rs = await http.put(ServiceId.IMPORT + "/update-payment-status",data);
  return rs.data;
}

const createImportDetail=async(data:any)=>{
  const rs=await http.post(ServiceId.IMPORT_PRODUCT,data);
  return rs.data;
}


export const importService={
    createImport,
    getImportByDate,
    updateImportPaymentStatus,
    createImportDetail
}