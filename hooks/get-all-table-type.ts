import { tabelService } from "@/service/table-service"
import { useQuery } from "@tanstack/react-query"

const useGetAllTableType=()=>{
const {data,isLoading}=useQuery({
    queryFn:()=>tabelService.getAllTableTye(),
    queryKey:['tablesType']
  })
  return {
    tableType:data,
    isLoading:isLoading
  }
}

export default useGetAllTableType