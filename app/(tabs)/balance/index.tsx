import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
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
import DeleteSimModal from "@/components/molecules/BalanceModals/DeleteSimModal";
import RedirectToTottoliModal from "@/components/molecules/BalanceModals/RedirectToTottoliModal";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { resetSimState } from "@/features/sims/simSlice";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { updateCurrentSim } from "@/features/sims/simSlice";
import { getDeviceUUID } from "@/utils/getUUID";
import { useAuth } from "@/context/auth";
import { getHasRedirectedFromTottoli, setHasRedirectedFromTottoli } from "@/utils/redirectionControl";
import { useTranslation } from "react-i18next";


const BalanceScreen = () => {
  const { t } = useTranslation();
  const baseMsg = "pages.deleteSimModal";
  const router = useRouter();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const dispatch = useDispatch();

  const [sims, setSims] = useState([]);
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [simPlans, setSimPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);
  const hasRestoredSimRef = useRef(false);
  const lastFetchedSimId = useRef<string | null>(null);
  const isFetching = useRef(false);

  const { signIn } = useAuth();

  const skipBalanceRef = useRef(false);


  const fetchSubscriberData = async (id: string, uuid: string) => {
    if (skipBalanceRef.current) {
      console.log("⛔️ Saltando efecto por redirección a /home");
      return;
    }

    console.log("📦 Disparando balance para:", { id });

    const sim = sims.find((sim) => sim.iccid === id);
    // Dentro de fetchSubscriberData
    if (sim?.provider === "tottoli") {
      console.warn("⛔️ [fetchSubscriberData] SIM 'tottoli' detectada ANTES de fetch. Redirigiendo...");
      skipBalanceRef.current = true;
      await AsyncStorage.removeItem("currentICCID");
      dispatch(resetSimState());
      setSelectedSimId(null);
      setHasRedirectedFromTottoli(true);
      console.log("🚀 [fetchSubscriberData] Redirigiendo a /home...");
      router.replace("/home");
      return;
    }


    if (isFetching.current) {
      console.log("⏳ Ya hay un fetch en curso");
      return;
    }

    if (lastFetchedSimId.current === id) {
      console.log("⚠️ Ya se hizo fetch de esta SIM, evitando duplicado:", id);
      return;
    }

    isFetching.current = true;
    lastFetchedSimId.current = id;

    try {
      setLoading(true);
      setSelectedSimId(id);
      dispatch(updateCurrentSim(sim));
      await AsyncStorage.setItem("currentICCID", id);
      console.log("💾 SIM guardada en AsyncStorage:", id);

      const response = await getSubscriberData(id, uuid);

      if (!response || !response.providers || response.providers.length === 0) {
        console.warn("⚠️ Respuesta vacía, la SIM puede no estar procesada aún.");
        setSimPlans([]);
        return;
      }

      const firstProvider = response.providers[0];
      console.log("📡 Provider actual:", firstProvider.provider);
      setSimPlans(firstProvider?.plans || []);

      if (firstProvider.provider === "tottoli") {
        console.warn("🚨 Provider es tottoli, abortando carga antes de guardar nada");
        if (!(await getHasRedirectedFromTottoli())) {
          setHasRedirectedFromTottoli(true);
          await AsyncStorage.removeItem("currentICCID");
          setSelectedSimId(null);
          dispatch(resetSimState());
          router.replace("/home");
        }
        return;
      }
    } catch (error) {
      console.error("❌ Error al obtener los planes de la SIM:", error);
      setSimPlans([]);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const init = async () => {
      console.log("🚀 Ejecutando init de BalanceScreen");

      const uuid = await getDeviceUUID();
      console.log("🔑 UUID cargado:", uuid);
      setDeviceUUID(uuid);

      const simsList = await listSubscriber(uuid);
      console.log("📱 SIMs disponibles:", simsList.map(s => s.iccid));
      setSims(simsList);

      const storedICCID = await AsyncStorage.getItem("currentICCID");
      console.log("💾 ICCID almacenado:", storedICCID);

      const sim = simsList.find(s => s.iccid === storedICCID);

      if (sim?.provider === "tottoli") {
        console.warn("🔁 SIM tottoli detectada, redirigiendo a /home");
        skipBalanceRef.current = true;
        setHasRedirectedFromTottoli(true);
        await AsyncStorage.removeItem("currentICCID");
        dispatch(resetSimState());
        setSelectedSimId(null);
        router.replace({ pathname: "/home" });
        return;
      }

      const alreadyRedirected = await getHasRedirectedFromTottoli();
      if (alreadyRedirected) {
        console.warn("🛑 Ya se redirigió por tottoli. No se restaura SIM.");
        return;
      }

      const defaultId = sim?.iccid || simsList[0]?.iccid;
      if (defaultId && isActive) {
        console.log("✅ [init] Restaurando SIM válida:", defaultId);
        hasRestoredSimRef.current = true;
        await fetchSubscriberData(defaultId, uuid);
      }
    };


    if (!hasRestoredSimRef.current && !skipBalanceRef.current) {
      init();
    }

    return () => {
      isActive = false;
    };
  }, []);


  const handleDeleteSim = async (iccid: string) => {
    const uuid = await getDeviceUUID();

    try {
      await deleteSubscriber(iccid, uuid);

      const updatedSims = await listSubscriber(uuid);
      const uniqueSims = Array.isArray(updatedSims)
        ? Array.from(new Map(updatedSims.map((sim: any) => [sim.iccid, sim])).values())
        : [];


      setSims(uniqueSims);

      if (uniqueSims.length === 0) {
        await AsyncStorage.removeItem("currentICCID");
        dispatch(resetSimState());
        router.replace("/(tabs)/home");
        return;
      }

      const newSim = uniqueSims[0];
      if (newSim.provider === "tottoli") {
        await AsyncStorage.removeItem("currentICCID");
        dispatch(resetSimState());
        setSelectedSimId(null);
        router.replace("/(tabs)/home");
        return;
      }

      await fetchSubscriberData(newSim.iccid, uuid);
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
        <HeaderEncrypted owner="encriptados" settingsLink="balance/settings/sim?from=balance" />


        <ScrollView contentContainerStyle={balanceStyles.content}>
          <SimCurrencySelector
            sims={sims
              .filter((sim) => sim != null)
              .map((sim) => {
                const mapped = {
                  id: sim.iccid,
                  name: sim.name,
                  logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
                  number: sim.iccid,
                  provider: sim.provider,
                };
                return mapped;
              })}
            selectedId={selectedSimId}
            // Dentro de onSelectSim
            onSelectSim={async (id) => {
              console.log("📤 onSelectSim invocado con id:", id);
              const uuid = await getDeviceUUID();
              const sim = sims.find(sim => sim.iccid === id);

              if (!sim) return;

              console.log("🖱 SIM seleccionada en modal:", sim);

              if (sim.provider === "tottoli") {
                console.warn("⛔️ SIM tottoli seleccionada en /balance. Redirigiendo...");
                skipBalanceRef.current = true;
                await AsyncStorage.removeItem("currentICCID");
                dispatch(resetSimState());
                setSelectedSimId(null);

                signIn({
                  simName: sim.name,
                  idSim: Number(sim.iccid),
                  code: 0,
                  provider: sim.provider,
                });

                setHasRedirectedFromTottoli(true);
                router.replace({ pathname: "/(tabs)/home" });
                return;
              }

              console.log("🔁 Cambiando SIM actual a:", sim.iccid);
              await fetchSubscriberData(id, uuid);
            }}
          />

          <View style={balanceStyles.separator} />

          {loading || !selectedSimId ? (
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
            <DeleteSimButton onPress={() => setShowDeleteModal(true)} />
          )}
        </ScrollView>
      </BackgroundWrapper>

      <RedirectToTottoliModal
        visible={showRedirectModal}
        onClose={() => setShowRedirectModal(false)}
        isDarkMode={isDarkMode}
      />

      <DeleteSimModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          if (selectedSimId) {
            await handleDeleteSim(selectedSimId);
            setShowDeleteModal(false);
          }
        }}
        simName={sims.find((sim) => sim.iccid === selectedSimId)?.name}
        isDarkMode={isDarkMode}
        t={t}
        baseMsg={baseMsg}
      />
    </>
  );
};

export default BalanceScreen;