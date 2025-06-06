import { categoryService } from "@/service/category-service"
import { useQuery } from "@tanstack/react-query"

const useGetAllCategories=()=>{
const {data,isLoading}=useQuery({
    queryFn:()=>categoryService.getCategory(),
    queryKey:['categories']
  })
  return {
    categories:data,
    isLoading:isLoading
  }
}

export default useGetAllCategories