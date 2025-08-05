import { useQuery } from "@tanstack/react-query"
import { tableService } from "../service/table-service"

const useGetAllTableType=()=>{
const {data,isLoading}=useQuery({
    queryFn:()=>tableService.getAllTableTypes(),
    queryKey:['tablesType']
  })
  return {
    tableType:data,
    tableTypeLoading:isLoading
  }
}

export default useGetAllTableType