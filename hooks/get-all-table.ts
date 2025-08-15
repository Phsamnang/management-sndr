import { tableService } from "@/service/table-service";
import { useQuery } from "@tanstack/react-query";

const useGetAllTable = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => tableService.getAllTables(),
    queryKey: ["tables"],
  });
  return {
    tableInfo: data?.data,
    isLoading: isLoading,
  };
};

export default useGetAllTable;
