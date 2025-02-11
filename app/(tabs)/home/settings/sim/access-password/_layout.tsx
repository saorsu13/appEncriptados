import { useModalPassword } from "@/context/modalpasswordprovider";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const { isModalVisible } = useModalPassword();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
