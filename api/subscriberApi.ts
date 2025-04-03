export const getSubscriberData = async (idSim: string) => {
  try {

    const response = await fetch(
      "https://encriptados.es/wp-json/encriptados/v1/subscriber",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
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


export const createSubscriber = async (subscriberData) => {
  try {
    const response = await fetch(
      "https://encriptados.es/wp-json/encriptados/v1/sims/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(subscriberData),
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al crear el subscriber:", error);
    throw error;
  }
};


export const updateSubscriber = async (id, updateData) => {
  try {
    const response = await fetch(
      `https://encriptados.es/wp-json/encriptados/v1/sims/update/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al actualizar el subscriber:", error);
    throw error;
  }
};

export const deleteSubscriber = async (id) => {
  try {
    const response = await fetch(
      `https://encriptados.es/wp-json/encriptados/v1/sims/delete/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al borrar el subscriber:", error);
    throw error;
  }
};

export const listSubscriber = async () => {
  try {
    const response = await fetch(
      `https://encriptados.es/wp-json/encriptados/v1/sims`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al listar el subscriber:", error);
    throw error;
  }
};
