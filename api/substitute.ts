import api from "@/config/api";

export const getSubstitutionNumber = async (id: string): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(`getSubstitutionNumber`, { id });

    return response.data;
  } catch (error) {
    return [];
  }
};
