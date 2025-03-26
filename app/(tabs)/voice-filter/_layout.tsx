import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        headerTransparent: true,
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: 'white',
      }}
    />
  );
}