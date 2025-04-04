const API_BASE_URL = "https://encriptados.es/wp-json/encriptados/v1";

/**
 * Obtiene la información del subscriber desde el backend.
 */
export const getSubscriberData = async (id: string, uuid: string) => {
  try {
    console.log("📡 getSubscriberData → Enviando request con:", { id, uuid });

    const response = await fetch(`${API_BASE_URL}/subscriber`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify({
        id: id,
        uuid,
        currency_code: "",
        country: "",
      }),
    });

    const text = await response.text();
    console.log("📨 getSubscriberData → Response Text:", text);

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    // Si la respuesta está vacía, retornamos un objeto vacío
    if (!text.trim()) {
      console.warn("Respuesta vacía de getSubscriberData.");
      return {};
    }

    const data = JSON.parse(text);
    console.log("✅ getSubscriberData → JSON Parseado:", data);

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
    console.error("🚨 Error en getSubscriberData:", error);
    throw error;
  }
};



/**
 * Crea un nuevo subscriber en el backend.
 */
export const createSubscriber = async (subscriberData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sims/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify(subscriberData),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorBody = await response.json();
        return errorBody; // ejemplo: { code: "duplicate_iccid" }
      }
      throw new Error(`❌ Error sin JSON: ${response.status}`);
    }

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    throw new Error("❌ Respuesta sin JSON válida");
  } catch (error) {
    console.error("🚨 Error al crear el subscriber:", error);
    throw error;
  }
};

/**
 * Actualiza un subscriber existente.
 */
export const updateSubscriber = async (id: string | number, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sims/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al actualizar el subscriber:", error);
    throw error;
  }
};

/**
 * Elimina un subscriber por ID.
 */
export const deleteSubscriber = async (id: string | number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sims/delete/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error al borrar el subscriber:", error);
    throw error;
  }
};

/**
 * Lista todos los subscribers.
 */
export const listSubscriber = async (uuid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sims/uuid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify({ uuid }),
    });

    const text = await response.text();
    console.log("📨 listSubscriber → Response Text:", text);

    if (!response.ok) {
      throw new Error(`❌ Error en el request: ${response.status}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("🚨 Error al listar el subscriber:", error);
    throw error;
  }
};


