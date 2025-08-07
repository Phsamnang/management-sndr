import { http } from "@/app/utils/http"

const ServiceId={
    PRODUCT:'/product'
}


const getAllProduct=async()=>{
    const rs=await http.get(ServiceId.PRODUCT)
    return rs.data;
}

export const productService={
    getAllProduct
}