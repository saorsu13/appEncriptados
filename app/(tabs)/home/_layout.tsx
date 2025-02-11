import { ThemeCustom } from "@/config/theme2";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { openModalRequired } from "@/features/modalPasswordRequired/modalPasswordRequiredSlice";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppState, AppStateStatus } from "react-native";

export default function Layout() {
  const { colors } = useTheme<ThemeCustom>();
  const { isModalVisible } = useModalPassword();

  const activePassword = useAppSelector(
    (state) => state.activePasswordRequired
  );
  const isRequiredModal = useAppSelector(
    (state) => state.modalPasswordRequired
  );

  const dispatch = useDispatch();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        if (activePassword.isActive) {
          dispatch(openModalRequired());
        }
      } else if (nextAppState === "inactive" || nextAppState === "background") {
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [activePassword.isActive, dispatch]);

  useEffect(() => {
    if (activePassword.isActive) {
      dispatch(openModalRequired());
    }
  }, []);

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
