import { http } from "@/app/utils/http"

const serviceId = {
    LOGIN: "/login",
}

async function login(data: any) {
   const response = await http.post(serviceId.LOGIN, data)
   return response.data?.data
}


export const authService = {
    login
}



