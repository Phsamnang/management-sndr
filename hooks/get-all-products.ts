import { productService } from "@/service/product-service"
import { useQuery } from "@tanstack/react-query"

const useGetAllProducts=()=>{
   
    const {data}=useQuery({
        queryFn:()=>productService.getAllProduct(),
        queryKey:['allProducts']
    })

    return {
        products:data
    }

}

export default useGetAllProducts;