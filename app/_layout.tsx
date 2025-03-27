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
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  Platform,
  BackHandler,
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

// Evita que el splash screen se cierre automáticamente
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showRequestPasswordComponent, setShowRequestPasswordComponent] =
    useState(false);
  const userRef = useRef<Promise<User | null> | null>(null);

  if (userRef.current === null) {
    userRef.current = loadUser();
  }

  useEffect(() => {
    const prepare = async () => {
      console.log("⏳ Preparando app...");
      await SplashScreen.preventAutoHideAsync();
  
      await loadAsync({
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
      });
  
      // Espera 500ms como buffer para asegurar que todo está listo
      setTimeout(async () => {
        console.log("✅ Recursos cargados, ocultando splash");
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

  useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
                      <AuthProvider
                        userPromise={userRef.current}
                        onLoaded={() => setAppIsReady(true)}
                      >
                        <QueryClientProvider client={queryClient}>
                          <SafeAreaView
                            style={styles.container}
                          >
                            {showRequestPasswordComponent && (
                              <RequestPasswordComponent />
                            )}
                            <CountdownProvider>
                              {appIsReady ? (
                                <>
                                  {/* ⚠️ Reemplazo de NavigationContainer con Stack de expo-router */}
                                  {console.log("🎬 appIsReady = true → renderizando Stack...")}
                                  <Stack
                                    screenOptions={{
                                      headerShown: false,
                                      gestureEnabled: true,
                                    }}
                                  >
                                    <Stack.Screen name="(tabs)"
                                      options={{
                                        headerShown: false,
                                        gestureEnabled: true,
                                        headerTransparent: true,
                                        headerTitle: '',
                                        headerBackTitleVisible: false,
                                        headerTintColor: 'transparent',
                                      }}
                                    />
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
                                </>
                              ) : null}
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
