// api/subscriberApi.ts (por ejemplo)

export const getSubscriberData = async (idSim: string) => {
    try {
      const response = await fetch(
        "https://encriptados.es/wp-json/encriptados/v1/subscriber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cookie": "mailpoet_page_view=%7B%22timestamp%22%3A1742322678%7D"
          },
          body: JSON.stringify({
            id: idSim,
            currency_code: "",
            country: "",
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error en el request: ${response.status}`);
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error obteniendo data del subscriber:", error);
      throw error;
    }
  };
  