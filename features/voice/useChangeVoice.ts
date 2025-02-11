import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";

async function changeVoice(id: number, voice: number): Promise<any> {
  try {
    const response = await api.post("/changeVoice", { id, voice });
    if (response.problem) {
      throw new Error(response.problem);
    }
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export function useChangeVoice() {
  const request = async (id, voice) => {
    const response = await changeVoice(id, voice);

    return { data: response.data };
  };

  return { request };
}
