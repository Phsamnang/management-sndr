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


export const menuService = {
    createMenu,
    getAllMenus
}   