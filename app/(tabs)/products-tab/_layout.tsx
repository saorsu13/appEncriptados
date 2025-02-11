import { ThemeCustom } from "@/config/theme2";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
