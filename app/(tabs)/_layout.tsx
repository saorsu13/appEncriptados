import { Redirect, Slot, usePathname } from "expo-router";
import { useAuth } from "@/context/auth";
import Loader from "@/components/molecules/Loader";
import NetInfo from "@react-native-community/netinfo";

import { useAppSelector, useAppDispatch } from "@/hooks/hooksStoreRedux";
import { ModalProvider } from "@/context/modal";

import { Text, View, StyleSheet, Platform } from "react-native";

import { ThemeMode } from "@/context/theme";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import theme from "@/config/theme";

import ModalPaymentController from "@/components/molecules/ModalPayment/ModalPaymentController";
import { ModalPaymentProvider } from "@/context/modalpayment";
import { useMenu } from "@/context/menuprovider";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import SimListModal from "@/components/molecules/SimListModal/SimListModal";
import {
  ModalAdminSimsProvider,
  useModalAdminSims,
} from "@/context/modaladminsims";
import { ModalActivateSimProvider } from "@/context/modalactivatesim";
import InsertSimCardModal from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";
import { t } from "i18next";


export default function TabOneScreen() {
  const { isLoggedIn, isLoading, getSignInRoute } = useAuth();
  const path = usePathname();

  const unsubscribe = NetInfo.addEventListener((state) => {
    state;
  });
  unsubscribe();

  const loading = useAppSelector((state) => state.loading.isLoading);
  const { isModalOpen } = useModalAdminSims();

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  return (
    <ModalActivateSimProvider>
      <ModalPaymentProvider>
        <ModalAdminSimsProvider>
          <ModalProvider>
            <InsertSimCardModal />
            <SimListModal />
            {!modalRequiredPassword ? <Loader visible={loading} /> : null}
            <TabLayout />
            <ModalPaymentController />
          </ModalProvider>
        </ModalAdminSimsProvider>
      </ModalPaymentProvider>
    </ModalActivateSimProvider>
  );
}

export function TabLayout() {
  const { themeMode } = useDarkModeTheme();
  const { isMenuVisible } = useMenu();
  const { colors } = useTheme<ThemeCustom>();

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor:
          themeMode === ThemeMode.Dark
            ? theme.colors.darkBlack04
            : theme.lightMode.colors.white,
      }}
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          display: "none",
          // height: isMenuVisible ? (Platform.OS === "ios" ? 100 : 100) : 0,
          // paddingTop: Platform.OS === "ios" ? 40 : 0,
          // borderWidth: 1,
          // backgroundColor: isMenuVisible
          //   ? theme.colors.darkBlack01
          //   : colors.background,
          // borderBlockColor: isMenuVisible
          //   ? theme.colors.darkBlack01
          //   : colors.background,
        },
      }}
    >
      {/* Tabs reales */}

      <Tabs.Screen
        name="home"
        options={{
          title: "",
          href: isMenuVisible ? "/home" : null,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.focusedCircle]}>
              <IconSvg height={25} width={25} color="#969696" type="sim" />
              <Text allowFontScaling={false} style={styles.tabText}>
                {t("pages.home-tab.simsMenu")}
              </Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen name="callback" options={{ headerShown: false }} />
      <Tabs.Screen name="new-sim" options={{ headerShown: false }} />
      <Tabs.Screen name="new-sim/edit-sim/[id]" options={{ headerShown: false }} />
      <Tabs.Screen name="substitute" options={{ headerShown: false }} />
      <Tabs.Screen name="settings-sign" options={{ headerShown: false }} />
      <Tabs.Screen name="voice-filter" options={{ headerShown: false }} />
      <Tabs.Screen name="offers" options={{ headerShown: false }} />
      <Tabs.Screen name="distributors" options={{ headerShown: false }} />
      <Tabs.Screen name="balance" options={{ headerShown: false }} />
      <Tabs.Screen name="new-sim-encrypted" options={{ headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? 5 : 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
  },
  focusedCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    paddingVertical: Platform.OS === "ios" ? 20 : 9,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabText: {
    fontSize: 10,
    color: "white",
    marginTop: 5,
  },
});