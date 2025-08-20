import { http } from "@/app/utils/http";


const ServiceId={
    MENU:"/menu",
}


const createMenu = async (data: any) => {
    const response = await http.post(ServiceId.MENU+"/create", data);
    return response?.data?.data;
}

const getAllMenus=async(tableId:number)=>{

    const rs=await http.get(ServiceId.MENU+`/${tableId}`)

    return rs.data?.data;

}

const getAllMenusWithprices = async () => {
  const rs = await http.get(ServiceId.MENU + `s`);

  return rs.data?.data;
};

const updatePrice=async(data:any)=>{
    const rs=await http.post(ServiceId.MENU+"/update",data);
    return rs.data?.data;
}

const updateImage = async (data:any) => {
    const formData = new FormData();
    formData.append("image", data.image);
  const rs = await http.post(ServiceId.MENU + `/${data.menuId}/image`, formData);
  return rs.data?.data;
};

const updateOrderDefualt=async(data:any)=>{
    const rs = await http.put(ServiceId.MENU + "/default-order",data);
    return rs.data;
}


const updateStockUsingQty=async(data:any)=>{
    const rs = await http.post(ServiceId.MENU + "/using-stock", data);
    return rs.data;
}

export const menuService = {
    createMenu,
    getAllMenus,
    getAllMenusWithprices,
    updatePrice,
    updateImage,
    updateOrderDefualt,
    updateStockUsingQty
}   