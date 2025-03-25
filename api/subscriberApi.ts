export const getSubscriberData = async (idSim: string) => {
    try {
      console.log("getSubscriberData => idSim recibido:", idSim);
  
      const response = await fetch(
        "https://encriptados.es/wp-json/encriptados/v1/subscriber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: idSim,
            currency_code: "",
            country: "",
          }),
        }
      );
  
      console.log("getSubscriberData => status del response:", response.status);
  
      if (!response.ok) {
        throw new Error(`Error en el request: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("getSubscriberData => data parseada:", data);
  
      return data;
    } catch (error) {
      console.error("Error obteniendo data del subscriber:", error);
      throw error;
    }
  };
  