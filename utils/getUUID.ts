import * as Application from "expo-application";
import { Platform } from "react-native";

export const getDeviceUUID = async (): Promise<string> => {
  if (Platform.OS === "android") {
    const androidId = await Application.getAndroidId();
    return androidId ?? "unknown-android-id";
  } else if (Platform.OS === "ios") {
    const iosId = await Application.getIosIdForVendorAsync();
    return iosId ?? "unknown-ios-id";
  }
  return "unknown-id";
};
