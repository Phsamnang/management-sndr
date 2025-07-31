import { http } from "@/app/utils/http";

const serviceId = {
  DELIVERY: "/delivery/foods",
  UPDATED: "/delivery/update",
};


const getDeliveryFoods = async () => {
  const response = await http.get(`${serviceId.DELIVERY}`);
  const data = response.data;
  return data;
};

const updateDelivery=async(data:any)=>{
  const res=await http.put(serviceId.UPDATED,data)
  return res.data;
}

export const deliveryService = {
  getDeliveryFoods,
  updateDelivery
};
