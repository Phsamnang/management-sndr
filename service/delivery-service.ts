import { http } from "@/app/utils/http";

const serviceId = {
  DELIVERY: "/delivery/foods",
};


const getDeliveryFoods = async () => {
  const response = await http.get(`${serviceId.DELIVERY}`);
  const data = response.data;
  return data;
};


export const deliveryService = {
  getDeliveryFoods,
};
