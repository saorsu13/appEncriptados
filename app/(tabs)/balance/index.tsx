import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  BackHandler,
  Platform,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import {
  listSubscriber,
  deleteSubscriber,
  getSubscriberData,
} from "@/api/subscriberApi";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";
import { LinearGradient } from "expo-linear-gradient";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { useDispatch } from "react-redux";
import { resetSimState } from "@/features/sims/simSlice";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";


const BalanceScreen = () => {
  const router = useRouter();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";

  const [sims, setSims] = useState([]);
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [simPlans, setSimPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [pendingRedirectSim, setPendingRedirectSim] = useState(null);

  const deviceUUID = useDeviceUUID();
  const dispatch = useDispatch();

  const fetchSubscriberData = async (id: string) => {
    if (!deviceUUID) {
      console.warn("UUID no disponible, se cancela la petición.");
      return;
    }
    try {
      setLoading(true);
      setSelectedSimId(id);
      const response = await getSubscriberData(id, deviceUUID);
      if (!response || !response.providers || response.providers.length === 0) {
        console.warn("Respuesta vacía, la SIM puede no estar procesada aún.");
        setSimPlans([]);
        return;
      }
      const firstProvider = response.providers[0];
      setSimPlans(firstProvider?.plans || []);

      // Mostrar modal si es Tottoli
      if (firstProvider.provider === "tottoli") {
        setPendingRedirectSim(firstProvider);
        setShowRedirectModal(true);
      }
    } catch (error) {
      console.error("❌ Error al obtener los planes de la SIM:", error);
      setSimPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    if (!deviceUUID) {
      console.warn("UUID no disponible, no se puede listar las SIMs.");
      return;
    }
    try {
      setLoading(true);
      const data = await listSubscriber(deviceUUID);
      setSims(Array.isArray(data) ? data : []);

      const storedICCID = await AsyncStorage.getItem("currentICCID");

      if (data && data.length > 0) {
        const defaultId =
          storedICCID && data.find((sim) => sim.iccid === storedICCID)
            ? storedICCID
            : data[0].iccid;

        setSelectedSimId(defaultId);
        fetchSubscriberData(defaultId);
      }
    } catch (error) {
      console.error("Error listando las SIMs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceUUID) {
      fetchSubscribers();
    }
  }, [deviceUUID]);

  useFocusEffect(
    useCallback(() => {
      if (deviceUUID) {
        fetchSubscribers();
      }
      if (Platform.OS === "android") {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => true
        );
        return () => backHandler.remove();
      }
    }, [deviceUUID])
  );

  const handleDeleteSim = async (iccid: string) => {
    if (!deviceUUID) {
      console.warn("❌ UUID no disponible, no se puede eliminar la SIM.");
      return;
    }

    try {
      const response = await deleteSubscriber(iccid, deviceUUID);

      const updatedSims = await listSubscriber(deviceUUID);
      const newSims = Array.isArray(updatedSims) ? updatedSims : [];

      const uniqueSims = Array.from(
        new Map(newSims.map((sim) => [sim.iccid, sim])).values()
      );

      setSims(uniqueSims);

      if (uniqueSims.length === 0) {
        dispatch(resetSimState());
        router.replace("/(tabs)/home");
        return;
      }

      const newSelectedId = uniqueSims[0].iccid;
      setSelectedSimId(newSelectedId);
      fetchSubscriberData(newSelectedId);
    } catch (error) {
      console.error("🚨 Error eliminando la SIM:", error);
    }
  };

  const BackgroundWrapper = isDarkMode ? View : LinearGradient;
  const backgroundProps = isDarkMode
    ? { style: [{ ...balanceStyles.container }, { backgroundColor: colors.background }] }
    : {
      colors: ["#E6F9FF", "#FFFFFF"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      style: balanceStyles.container,
    };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: "white",
          gestureEnabled: true,
        }}
      />

      <BackgroundWrapper {...backgroundProps}>
        <HeaderEncrypted owner="encriptados" settingsLink="home/settings/sim" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          <SimCurrencySelector
            sims={sims
              .filter((sim) => sim != null)
              .map((sim) => ({
                id: sim.iccid,
                name: sim.name,
                logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
                number: sim.iccid,
              }))}
            selectedId={selectedSimId}
            onSelectSim={(id) => fetchSubscriberData(id)}
          />

          <View style={balanceStyles.separator} />

          {loading ? (
            <View style={balanceStyles.loadingContainer}>
              <ActivityIndicator size="small" color="#00AEEF" />
            </View>
          ) : (
            simPlans.map((plan, index) => {
              const totalMB = Number(plan.pckdatabyte) || 0;
              const usedMB = Number(plan.useddatabyte) || 0;
              const remainingMB = Math.max(totalMB - usedMB, 0);
              const remainingGB = (remainingMB / 1024).toFixed(2);

              return (
                <DataBalanceCard
                  key={index}
                  totalData={remainingGB}
                  format="GB"
                  region={plan.name || "Sin región"}
                />
              );
            })
          )}

          <TopUpCard />

          {selectedSimId && (
            <DeleteSimButton onPress={() => handleDeleteSim(selectedSimId)} />
          )}
        </ScrollView>
      </BackgroundWrapper>

      {showRedirectModal && (
        <Modal animationType="fade" transparent visible={showRedirectModal}>
          <View style={balanceStyles.modalOverlay}>
            <View
              style={[
                balanceStyles.modalBox,
                { backgroundColor: isDarkMode ? "#000" : "#fff" },
              ]}
            >
              <IconSvg type="checkcircle" width={60} height={60} color="#00C566" />
              <Text
                style={[
                  balanceStyles.modalTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                ¿Deseas ir a la vista de Tottoli?
              </Text>
              <Text
                style={[
                  balanceStyles.modalSubtitle,
                  { color: isDarkMode ? "#ccc" : "#444" },
                ]}
              >
                Esta SIM está asociada a Tottoli. Puedes ir al panel correspondiente.
              </Text>
              <TouchableOpacity
                style={[balanceStyles.modalButton, { backgroundColor: "#D32F2F" }]}
                onPress={() => {
                  setShowRedirectModal(false);
                  dispatch(resetSimState());
                  router.replace("/(tabs)/home");
                }}
              >
                <Text style={balanceStyles.modalButtonText}>Ir al panel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  balanceStyles.modalButton,
                  {
                    backgroundColor: isDarkMode ? "#444" : "#ccc",
                    marginTop: 8,
                  },
                ]}
                onPress={() => setShowRedirectModal(false)}
              >
                <Text
                  style={[
                    balanceStyles.modalButtonText,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default BalanceScreen;