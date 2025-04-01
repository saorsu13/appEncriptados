import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        headerTransparent: true,
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: 'white',
      }}
    />
  );
}