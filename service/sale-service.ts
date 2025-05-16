import { http } from "@/app/utils/http"

const ServiveID={
    SALE:'/sale'
}

const createSale=async(tableId:number)=>{
    const response=await http.post(ServiveID.SALE,{
         tableId
    });
    return response.data;
}

export const SaleService={
    createSale
}