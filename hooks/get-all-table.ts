import { tabelService } from "@/service/table-service"
import { useQuery } from "@tanstack/react-query"

const useGetAllTable=()=>{
const {data,isLoading}=useQuery({
    queryFn:()=>tabelService.getAllTable(),
    queryKey:['tables']
  })
  return {
    tableInfo:data,
    isLoading:isLoading
  }
}

export default useGetAllTable