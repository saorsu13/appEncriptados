import { Stack } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";

export default function BalanceLayout() {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <Stack
      screenOptions={{
        headerShown: true, // ✅ iOS necesita esto para permitir swipe-back
        gestureEnabled: true, // ✅ Habilita el gesto de retroceso en iOS
        contentStyle: { backgroundColor: colors.background }, // ✅ Mantiene el fondo
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true, // ✅ iOS necesita el header visible para el swipe-back
          gestureEnabled: true, // ✅ Habilita el gesto de retroceso en iOS
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
