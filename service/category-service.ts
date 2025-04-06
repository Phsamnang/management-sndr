import { http } from "@/app/utils/http";

const ServiceId={
    CATEGORY:"/category",
}

const getCategory = async () => {
    const response = await http.get(ServiceId.CATEGORY);
    return response?.data;
}
export const categoryService = {
         getCategory,
    }