import "@/assets/styles/styles.css";
import {
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_400Regular,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack, Slot  } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  AppState,
  AppStateStatus,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import "../config/i18n/i18n";
import { AuthProvider, User, loadUser } from "../context/auth";
import { store } from "../store";
import { ThemeProvider } from "@shopify/restyle";
import theme from "@/config/theme";
import { loadAsync } from "expo-font";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CountdownProvider } from "@/context/countdown";
import { DarkModeProvider } from "@/context/theme";
import ThemeProviderComponent from "@/context/themeprovider";
import { MenuProvider } from "@/context/menuprovider";
import RequestPasswordComponent from "@/context/requestpasswordprovider";
import { ModalPasswordProvider } from "@/context/modalpasswordprovider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RestoreSessionWrapper from "@/components/organisms/RestoreSession/RestoreSessionWrapper";
import { isFirstLaunch } from "@/utils/firstInstallCheck";
import { getDeviceUUID } from "@/utils/getUUID";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showRequestPasswordComponent, setShowRequestPasswordComponent] = useState(false);

  // ✅ userPromise para cargar datos persistidos de sesión
  const userRef = useRef<Promise<{ user: User | null; balance: string | null }> | null>(null);
  if (userRef.current === null) {
    userRef.current = loadUser(); 
  }


  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      await loadAsync({
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
      });
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }, 500);
    };
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      const timer = setTimeout(() => {
        setShowRequestPasswordComponent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const checkInstall = async () => {
      const firstTime = await isFirstLaunch();
      if (firstTime) {
        console.log("🚀 Primera vez que se lanza la app (instalación nueva)");
        // Aquí puedes hacer limpieza, redirección, etc.
      } else {
        console.log("✅ App ya se había abierto antes.");
      }
      // 👇 Agrega esto para ver el UUID que se está usando
    const uuid = await getDeviceUUID();
    console.log("🆔 [RootLayout] UUID actual del dispositivo:", uuid);
    };
  
    checkInstall();
  }, []);
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <DarkModeProvider>
            <ThemeProvider theme={theme}>
              <ThemeProviderComponent>
                <Provider store={store}>
                  <MenuProvider>
                    <ModalPasswordProvider>
                    <AuthProvider userPromise={userRef.current} onLoaded={() => setAppIsReady(true)}>
                      <RestoreSessionWrapper onFinish={() => setAppIsReady(true)} />
                        <QueryClientProvider client={queryClient}>
                          <SafeAreaView style={styles.container}>
                            {showRequestPasswordComponent && <RequestPasswordComponent />}
                            <CountdownProvider>
                              <Stack
                                screenOptions={{
                                  headerShown: false,
                                  gestureEnabled: true,
                                  presentation: "transparentModal",
                                }}
                              >
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="index" options={{ headerShown: false }} />
                              </Stack>
                            </CountdownProvider>
                          </SafeAreaView>
                        </QueryClientProvider>
                      </AuthProvider>
                    </ModalPasswordProvider>
                  </MenuProvider>
                </Provider>
              </ThemeProviderComponent>
            </ThemeProvider>
          </DarkModeProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlack04,
  },
});
