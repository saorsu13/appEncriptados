import React, { useEffect, useRef, useState, useMemo } from "react";
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
import SignIn from "@/components/organisms/SignIn/SignIn";


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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);

  const hasRestoredSimRef = useRef(false);
  const lastFetchedSimId = useRef<string | null>(null);
  const isFetching = useRef(false);
  const skipBalanceRef = useRef(false);

  const { signIn, signOut, isLoggedIn } = useAuth();


  const fetchSubscriberData = async (sim: any, uuid: string) => {
    const id = sim.iccid;
    console.log("🔄 [Balance] fetchSubscriberData llamada con:", { id, uuid });

    if (skipBalanceRef.current) {
      console.log("⛔️ [Balance] Efecto saltado por redirección");
      return;
    }

    if (sim?.provider === "tottoli") {
      console.warn("🚫 [Balance] SIM tottoli detectada, redirigiendo a /home");
      skipBalanceRef.current = true;
      await AsyncStorage.removeItem("currentICCID");
      dispatch(resetSimState());
      setSelectedSimId(null);
      setHasRedirectedFromTottoli(true);
      router.replace("/home");
      return;
    }

    if (isFetching.current) {
      console.log("⏳ [Balance] Fetch ya en curso, saliendo");
      return;
    }

    if (lastFetchedSimId.current === id) {
      console.log("⚠️ [Balance] Ya se hizo fetch para esta SIM, evitando duplicado");
      return;
    }

    isFetching.current = true;
    lastFetchedSimId.current = id;

    try {
      setLoading(true);
      setSelectedSimId(id);
      dispatch(updateCurrentSim(sim.iccid));
      await AsyncStorage.setItem("currentICCID", sim.iccid);
      console.log("💾 [Balance] SIM seteada y guardada:", id);

      const response = await getSubscriberData(id, uuid);
      console.log("📥 [Balance] Datos de suscriptor recibidos:", response);

      if (!response || !response.providers || response.providers.length === 0) {
        console.warn("⚠️ [Balance] Respuesta sin planes");
        setSimPlans([]);
        return;
      }

      const firstProvider = response.providers[0];
      setSimPlans(firstProvider?.plans || []);
    } catch (error) {
      console.error("❌ [Balance] Error al obtener datos del suscriptor:", error);
      setSimPlans([]);
    } finally {
      isFetching.current = false;
      setLoading(false);
      skipBalanceRef.current = false;
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("🚀 [Balance] init ejecutado");

      const uuid = await getDeviceUUID();
      console.log("🔑 [Balance] UUID del dispositivo:", uuid);
      setDeviceUUID(uuid);

      const simsList = await listSubscriber(uuid);
      console.log("📋 [Balance] SIMs obtenidas:", simsList);

      if (!Array.isArray(simsList) || simsList.length === 0) {
        console.warn("🚫 [Balance] No hay SIMs asociadas, cerrando sesión...");
        await AsyncStorage.removeItem("currentICCID");
        dispatch(resetSimState());

        await signOut();

        router.replace("/home");
        return;
      }

      setSims(simsList);

      const storedICCID = await AsyncStorage.getItem("currentICCID");
      console.log("💾 [Balance] ICCID almacenado:", storedICCID);

      let sim = simsList.find((s) => s.iccid === storedICCID);

      if (!sim) {
        console.warn("⚠️ [Balance] SIM almacenada no encontrada, usando fallback");
        sim = simsList[0];
        if (sim) {
          await AsyncStorage.setItem("currentICCID", sim.iccid);
        }
      }

      if (!sim) {
        console.warn("🚫 [Balance] No hay SIMs disponibles");
        return;
      }

      const alreadyRedirected = await getHasRedirectedFromTottoli();
      
      if (alreadyRedirected) {
        console.warn("🛑 [Balance] Redirección previa detectada");
      
        const simValida = simsList.find(
          (s) => s.iccid === storedICCID && s.provider !== "tottoli"
        );
      
        if (simValida) {
          console.log("✅ [Balance] Redirigido previamente pero SIM actual es válida:", simValida.iccid);
          setHasRedirectedFromTottoli(false);
          hasRestoredSimRef.current = true;
          await fetchSubscriberData(simValida, uuid);
          return;
        }
      
        return;
      }
      
      
      if (!hasRestoredSimRef.current && !skipBalanceRef.current && sim) {
        console.log("✅ [Balance] Restaurando SIM directamente:", sim.iccid);
        hasRestoredSimRef.current = true;
        await fetchSubscriberData(sim, uuid);
      }
    };

    if (!hasRestoredSimRef.current && !skipBalanceRef.current) {
      init();
    }
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

      await fetchSubscriberData(newSim, uuid);
    } catch (error) {
      console.error("🚨 Error eliminando la SIM:", error);
    }
  };

  if (!isLoggedIn) {
    console.log("🔐 [BalanceScreen] Usuario no autenticado, mostrando SignIn");
    return <SignIn />;
  }

  const mappedSims = useMemo(() => {
    const result = sims
      .filter((sim) => sim != null)
      .map((sim) => ({
        id: sim.iccid,
        name: sim.name,
        logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
        number: sim.iccid,
        provider: sim.provider,
      }));
  
    console.log("🧭 [Balance] Sims mapeadas para SimCurrencySelector:", result.map(r => r.id));
    return result;
  }, [sims]);

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
        {Array.isArray(sims) && (
          <SimCurrencySelector
            sims={mappedSims}
            selectedId={selectedSimId}
            onSelectSim={async (id) => {
              console.log("📤 [Balance] onSelectSim invocado con id:", id);
              const uuid = await getDeviceUUID();
              const sim = sims.find(sim => sim.iccid === id);

              if (!sim) return;

              console.log("🖱 [Balance] SIM seleccionada en modal:", sim);

              if (sim.provider === "tottoli") {
                console.warn("⛔️ [Balance] SIM tottoli seleccionada en /balance. Redirigiendo...");
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

              console.log("🔁 [Balance] Cambiando SIM actual a:", sim.iccid);
              await fetchSubscriberData(sim, uuid);
            }}
          />
        )}

          <View style={balanceStyles.separator} />

          {loading || !selectedSimId ? (
            <View style={balanceStyles.loadingContainer}>
              <ActivityIndicator size="small" color="#00AEEF" />
            </View>
          ) : (
            simPlans.map((plan, index) => {
              const totalMB = Number(plan.pckdatabyte) || 0;
              const usedMB = Number(plan.useddatabyte) || 0;

              if (isNaN(totalMB) || isNaN(usedMB)) {
                console.warn("⚠️ [Balance] Plan inválido en índice", index, plan);
                return null;
              }

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
            setIsDeleting(true);
            await handleDeleteSim(selectedSimId);
            setIsDeleting(false);
            setShowDeleteModal(false);
          }
        }}
        simName={sims.find((sim) => sim.iccid === selectedSimId)?.name}
        isDarkMode={isDarkMode}
        t={t}
        baseMsg={baseMsg}
        isDeleting={isDeleting}
      />

    </>
  );
};

export default BalanceScreen;