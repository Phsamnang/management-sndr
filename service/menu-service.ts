import { http } from "@/app/utils/http";


const ServiceId={
    MENU:"/menu",
}


const createMenu = async (data: any) => {
    const response = await http.post(ServiceId.MENU+"/create", data);
    return response?.data;
}

const getAllMenus=async(tableId:number)=>{

    const rs=await http.get(ServiceId.MENU+`/${tableId}`)

    return rs.data;

}

const getAllMenusWithprices = async () => {
  const rs = await http.get(ServiceId.MENU + `s`);

  return rs.data;
};

const updatePrice=async(data:any)=>{
    const rs=await http.post(ServiceId.MENU+"/update",data);
    return rs.data;
}


export const menuService = {
    createMenu,
    getAllMenus,
    getAllMenusWithprices,
    updatePrice
}   