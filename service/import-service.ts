import { http } from "@/app/utils/http"

const ServiceId={
    IMPORT:"/import"
}

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


export const importService={
    createImport,
    getImportByDate
}