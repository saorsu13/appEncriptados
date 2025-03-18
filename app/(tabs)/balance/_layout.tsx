import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function BalanceLayout() {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔥 Oculta el header en TODAS las pantallas de "balance"
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}