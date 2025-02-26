import { http } from "@/app/utils/http";

const ServiceId = {
    getEmployee: "employee",
}

const getEmployee = async () => {
    const response = await http.get(ServiceId.getEmployee);   
    return response.data?.data;
}


export const employeeService = {
    getEmployee,
}
