import { http } from "@/app/utils/http";

const ServiceId={
    MENU:"/menu",
}


const createMenu = async (data: any) => {
    const response = await http.post(ServiceId.MENU+"/create", data);
    return response?.data;
}


export const menuService = {
    createMenu,
}   