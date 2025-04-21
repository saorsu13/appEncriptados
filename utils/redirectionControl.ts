import AsyncStorage from "@react-native-async-storage/async-storage";

let hasRedirectedFromTottoli = false;

export async function getHasRedirectedFromTottoli() {
  if (hasRedirectedFromTottoli) return true;

  const stored = await AsyncStorage.getItem("hasRedirectedFromTottoli");
  return stored === "true";
}

export async function setHasRedirectedFromTottoli(value: boolean) {
  hasRedirectedFromTottoli = value;
  await AsyncStorage.setItem("hasRedirectedFromTottoli", value ? "true" : "false");
}
