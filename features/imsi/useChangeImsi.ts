import api from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import { useQuery } from "@tanstack/react-query";
import { setLoading } from "../loading/loadingSlice";

async function changeImsi(id: number, switchValue: string): Promise<any> {
  try {
    const response = await api.post("/changeImsi", { id, switch: switchValue });
    if (response.problem) {
      throw new Error(response.problem);
    }
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export function useChangeImsi(
  id: number,
  switchValue: string,
  handleError: (error: any) => void,
  handleOnCompleted: (problem: any) => void
) {
  const dispatch = useAppDispatch();

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  const handleChangeImsi = async () => {
    if (modalRequiredPassword) {
      dispatch(setLoading(true));
    }

    try {
      const response = await changeImsi(id, switchValue);

      handleOnCompleted(response.problem);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      handleError(error);
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };

  const query = useQuery({
    queryKey: ["changeImsi"],
    queryFn: handleChangeImsi,
    enabled: false,
    retry: false,
  });

  return query;
}
