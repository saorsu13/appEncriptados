export const getSubscriberData = async (idSim: string) => {
  try {
    console.log("📩 getSubscriberData => idSim recibido:", idSim);

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

    console.log("📡 getSubscriberData => status del response:", response.status);

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    const data = await response.json();
    const providers = data.providers || [];

    const firstProvider = providers[0];
    const firstPlan = firstProvider?.plans?.[0];

    console.log("📦 Respuesta completa del endpoint:", JSON.stringify(data, null, 2));
    console.log("🪙 Balance recibido:", firstProvider?.balance);
    console.log("📶 Plan completo:", JSON.stringify(firstPlan, null, 2));

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
