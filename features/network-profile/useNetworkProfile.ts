import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export async function changeNetworkProfile(
  id: string,
  profile: string
): Promise<any> {
  try {
    const response = await api.post("/changeProfile", { id, switch: profile });

    return response;
  } catch (error) {
    error;
  }
}
