import { http } from "@/app/utils/http";

const ServiceId={
    CATEGORY:"/category",
}

const getCategory = async () => {
    const response = await http.get(ServiceId.CATEGORY);
    return response?.data;
}
const createCategory = async (data:any)=>{
    const rs=await http.post(ServiceId.CATEGORY,data);
    return rs.data?.data;
}
export const categoryService = {
         getCategory,
         createCategory
    }