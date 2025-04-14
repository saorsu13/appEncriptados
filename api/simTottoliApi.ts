const API_BASE_URL = "https://encriptados.es/wp-json/encriptados/v1";

/**
 * Obtiene la tasa de cambio de monedas.
 */
export const getExchangeRate = async () => {
  try {
    console.log("💱 getExchangeRate → Solicitando tasa de cambio...");
    const response = await fetch(`${API_BASE_URL}/exchange-rate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en getExchangeRate: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ getExchangeRate → Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error("🚨 getExchangeRate → Error inesperado:", error);
    throw error;
  }
};

/**
 * Obtiene el número de sustitución para un ID dado.
 */
export const getSubstitutionNumber = async (id) => {
  try {
    console.log(`🔢 getSubstitutionNumber → ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/substitution-number/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en getSubstitutionNumber: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ getSubstitutionNumber → Número de sustitución:", data);
    return data;
  } catch (error) {
    console.error("🚨 getSubstitutionNumber → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia el callback de un Tottoli.
 */
export const changeCallback = async ({ id, callback }) => {
  try {
    console.log(`📞 changeCallback → ID: ${id}, callback: ${callback}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, callback }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeCallback: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeCallback → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeCallback → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia el IMSI de un Tottoli.
 */
export const changeImsi = async ({ id, switch: imsiSwitch }) => {
  try {
    console.log(`🔄 changeImsi → ID: ${id}, switch: ${imsiSwitch}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-imsi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, switch: imsiSwitch }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeImsi: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeImsi → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeImsi → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia el perfil de un Tottoli.
 */
export const changeProfile = async ({ id, switch: profileSwitch }) => {
  try {
    console.log(`🛠️ changeProfile → ID: ${id}, switch: ${profileSwitch}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, switch: profileSwitch }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeProfile: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeProfile → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeProfile → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia el número de sustitución.
 */
export const changeNumberSubstitution = async ({ id, numberSubstitution }) => {
  try {
    console.log(`🔢 changeNumberSubstitution → ID: ${id}, numberSubstitution: ${numberSubstitution}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-number-substitution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, numberSubstitution }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeNumberSubstitution: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeNumberSubstitution → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeNumberSubstitution → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia dinámicamente el número de sustitución (sin payload adicional).
 */
export const changeNumberDynamic = async (id) => {
  try {
    console.log(`⚡ changeNumberDynamic → ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-number-dinamyc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeNumberDynamic: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeNumberDynamic → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeNumberDynamic → Error inesperado:", error);
    throw error;
  }
};

/**
 * Cambia la configuración de voz de un Tottoli.
 */
export const changeVoice = async ({ id, voice }) => {
  try {
    console.log(`🎤 changeVoice → ID: ${id}, voice: ${voice}`);
    const response = await fetch(`${API_BASE_URL}/tottoli/change-voice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, voice }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error en changeVoice: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ changeVoice → Respuesta:", data);
    return data;
  } catch (error) {
    console.error("🚨 changeVoice → Error inesperado:", error);
    throw error;
  }
};
