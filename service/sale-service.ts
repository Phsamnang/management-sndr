import { http } from "@/app/utils/http"

const ServiveID={
    SALE:'/sale',
    ORDER:'/order'
}

const createSale=async(tableId:number)=>{
    const response=await http.post(ServiveID.SALE,{
         tableId
    });
    return response.data;
}

const orderFood=async(data:any)=>{
    const rs=await http.post(ServiveID.ORDER,{data})

    return rs.data;
}

const getSale=async(tableId:number)=>{
    const res=await http.get(ServiveID.SALE+`/${tableId}`);
    return res.data;
}

export const SaleService={
    createSale,
    orderFood,
    getSale
}