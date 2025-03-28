import { ThemeCustom } from "@/config/theme2";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function Layout() {
  const { colors } = useTheme<ThemeCustom>();
  const { isModalVisible } = useModalPassword();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
          headerBackTitleVisible: false,
          headerTintColor: 'transparent',
        }}
      />
    </Stack>
  );
}
