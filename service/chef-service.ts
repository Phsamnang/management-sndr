import { http } from "@/app/utils/http";

const ServiceId = {
  CHEF_SERVICE: "/chef/foods",
};

const getFoods = async () => {
  const response = await http.get(ServiceId.CHEF_SERVICE);
  return response.data;
};

const updateFoodStatus = async (data: any) => {
  const response = await http.put(`${ServiceId.CHEF_SERVICE}`, data);
  return response.data;
};

export const ChefService = {
  getFoods,
  updateFoodStatus,
};
