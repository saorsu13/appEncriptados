export const getSubscriberData = async (idSim: string) => {
  try {

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


    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    const data = await response.json();
    const providers = data.providers || [];

    const firstProvider = providers[0];
    const firstPlan = firstProvider?.plans?.[0];


    return {
      providers,
      provider: firstProvider?.provider,
      balance: firstProvider?.balance,
      plan: firstPlan,
    };
  } catch (error) {
    console.error("🚨 Error obteniendo data del subscriber:", error);
    throw error;
  }
};
