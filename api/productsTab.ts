import api from "@/config/api";

type Type = "app" | "sim" | "mobile";

export const getFaqs = async (currentLanguage): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(
      `/shop/faqs?lang=${currentLanguage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs in Spanish:", error);
    throw error;
  }
};

export const getProducts = async (type: Type): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(
      `/shop/getProducts?category=${type}&language=es`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Products", error);
    throw error;
  }
};

export const getProductsById = async (
  id: string | number
): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(`/shop/getProducts?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Products", error);
    throw error;
  }
};
