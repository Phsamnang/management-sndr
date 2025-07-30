import { http } from "@/app/utils/http"

const ServiveID={
    SALE:'/sale',
    ORDER:'/order',
    PAYMENT:'/sale/payment'
}

const createSale=async(tableId:number)=>{
    const response=await http.post(ServiveID.SALE,{
         tableId
    });
    return response.data;
}

const orderFood=async(data:any)=>{
    const rs=await http.post(ServiveID.ORDER,{...data})

    return rs.data;
}

const getSale=async(tableId:number)=>{
    const res=await http.get(ServiveID.SALE+`/${tableId}`);
    return res.data;
}

const getSaleById=async(saleId:number)=>{
    const res=await http.get(ServiveID.SALE+`/${saleId}/items`);
    return res.data;
}

const removeItem = async (saleItemId: number) => {
  const res = await http.delete(ServiveID.SALE + `/${saleItemId}/item`);
  return res.data;
};

const updateMenuPrice=async(payload:any)=>{
      const res = await http.post(ServiveID.SALE+`/update`,payload);
  return res.data;
}

const salePayment=async(data:any)=>{
    const res=await http.post(ServiveID.PAYMENT,data);
    return res.data;
}

const getSaleByDate=async(startDate:any,endDate:any)=>{
    const res=await http.get(ServiveID.SALE,{
        params:{
           startDate:startDate,
           endDate:endDate
        }
    })
    return res.data;
}

export const SaleService={
    createSale,
    orderFood,
    getSale,
    getSaleById,
    removeItem,
    updateMenuPrice,
    salePayment,
    getSaleByDate
}