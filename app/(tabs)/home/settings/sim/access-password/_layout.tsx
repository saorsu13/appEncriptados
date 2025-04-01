import { useModalPassword } from "@/context/modalpasswordprovider";
import { Stack } from "expo-router";

export default function Layout() {
  const { isModalVisible } = useModalPassword();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen name="index"
        options={{
          headerShown: false,
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
