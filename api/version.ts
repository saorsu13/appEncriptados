import api from "@/config/api";

interface VersionResponse {
  id: string;
  app_name: string;
  version: string;
}

export const getVersion = async (
  app: "encriptados" | "fantasma"
): Promise<VersionResponse[]> => {
  try {
    const response = await api.get<VersionResponse[]>(`/getVersion?app=${app}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch version for ${app}:`, error);
    return [];
  }
};
