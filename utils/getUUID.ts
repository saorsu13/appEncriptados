import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { isFirstLaunch } from "./firstInstallCheck";

const UUID_KEY = "custom_device_uuid";

export const getDeviceUUID = async (): Promise<string> => {
  try {
    // Si ya existe, lo usamos
    const storedUUID = await AsyncStorage.getItem(UUID_KEY);
    if (storedUUID) {
      console.log("📦 UUID ya almacenado:", storedUUID);
      return storedUUID;
    }

    // Obtenemos el ID base según plataforma
    let baseUUID = "unknown-id";
    if (Platform.OS === "android") {
      baseUUID = (await Application.getAndroidId()) ?? "unknown-android-id";
    } else if (Platform.OS === "ios") {
      baseUUID = (await Application.getIosIdForVendorAsync()) ?? "unknown-ios-id";
    }

    // Detectamos si es la primera vez que se lanza la app
    const isNewInstall = await isFirstLaunch();

    let finalUUID = baseUUID;
    if (isNewInstall) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
      finalUUID = `${baseUUID}-${randomSuffix}`;
      console.log("🎉 Instalación nueva, UUID modificado:", finalUUID);
    } else {
      console.log("✅ Instalación previa, UUID base:", finalUUID);
    }

    // Guardamos para reutilizar en futuros lanzamientos
    await AsyncStorage.setItem(UUID_KEY, finalUUID);
    return finalUUID;
  } catch (error) {
    console.error("❌ Error al generar UUID:", error);
    return "fallback-uuid";
  }
};
