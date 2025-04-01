import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function Layout() {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index"
        options={{
          headerShown: true,
          gestureEnabled: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => null,
          headerBackTitleVisible: false,
          headerTintColor: 'transparent',
        }}
      />
    </Stack>
  );
}
