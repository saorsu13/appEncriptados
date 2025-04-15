import { useEffect, useState } from "react";
import * as Application from "expo-application";
import { Platform } from "react-native";

export function useDeviceUUID() {
  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);

  useEffect(() => {
    const getUUID = async () => {
      let uuid = "unknown-id";
      if (Platform.OS === "android") {
        const androidId = await Application.getAndroidId(); 
        uuid = androidId ?? "unknown-android-id";
      } else if (Platform.OS === "ios") {
        const iosId = await Application.getIosIdForVendorAsync();
        uuid = iosId ?? "unknown-ios-id";
      }
      setDeviceUUID(uuid);
    };

    getUUID();
  }, []);

  return deviceUUID;
}
