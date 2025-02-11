import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { setLoading } from "@/features/loading/loadingSlice";
import { useAppDispatch } from "@/hooks/hooksStoreRedux";

async function updateCallback(
  dispatch: ReturnType<typeof useAppDispatch>,
  id: number,
  isCallback: boolean,
  handleError: () => void,
  handleOnCompleted: () => void
): Promise<any> {
  try {
    dispatch(setLoading(true));
    const response = await api.post("/changeCallback", {
      id,
      callback: isCallback ? 0 : 1,
    });

    if (response.problem) {
      throw new Error(response.problem);
    }

    handleOnCompleted();
    dispatch(setLoading(false));

    return response;
  } catch (error) {
    handleError();
    dispatch(setLoading(false));
  }
}

export function useChangeCallback(
  id: number,
  isCallback: boolean,
  handleError: () => void,
  handleOnCompleted: () => void
) {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["callback"],
    queryFn: () =>
      updateCallback(dispatch, id, isCallback, handleError, handleOnCompleted),
    enabled: false,
    retry: false,
  });

  return query;
}
