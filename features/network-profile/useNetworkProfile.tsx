import api from "@/config/api";
import { useAppDispatch } from "@/hooks/hooksStoreRedux";
import { useQuery } from "@tanstack/react-query";
import { setLoading } from "../loading/loadingSlice";

async function changeNetworkProfile(
  id: number,
  profile: string,
  handleError
): Promise<any> {
  try {
    const response = await api.post("/changeProfile", { id, switch: profile });

    if (response.problem) {
      handleError(response.problem);
      throw new Error(response.problem);
    }
    return response;
  } catch (error) {
    handleError(error);
    throw new Error(error);
  }
}

export function useNetworkProfile(id: number, profile: string, handleError) {
  const query = useQuery({
    queryKey: ["networkProfile"],
    queryFn: () => changeNetworkProfile(id, profile, handleError),
    enabled: false,
    retry: false,
  });

  return query;
}
