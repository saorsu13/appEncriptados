import React, { useEffect, useMemo, useState, useRef } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import { useAuth } from "@/context/auth";
import SignIn from "@/components/organisms/SignIn/SignIn";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useRouter } from "expo-router";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import { updateCurrentSim, resetSimState } from "@/features/sims/simSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { getDeviceUUID } from "@/utils/getUUID";
import { getSubscriberData, listSubscriber, deleteSubscriber, } from "@/api/subscriberApi";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";
import DeleteSimModal from "@/components/molecules/BalanceModals/DeleteSimModal";
import { useTranslation } from "react-i18next";
import { setSims } from "@/features/sims/simSlice";



const BalanceScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const { isLoggedIn } = useAuth();

  const dispatch = useDispatch();

  const router = useRouter();
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const allSims = useAppSelector((state) => state.sims.sims);

  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [simPlans, setSimPlans] = useState([]);
  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);
  const lastFetchedSimId = useRef<string | null>(null);
  const isFetching = useRef(false);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const BackgroundWrapper = isDarkMode ? View : require("expo-linear-gradient").LinearGradient;
  const backgroundProps = isDarkMode
    ? { style: [{ ...balanceStyles.container }, { backgroundColor: colors.background }] }
    : {
        colors: ["#E6F9FF", "#FFFFFF"],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        style: balanceStyles.container,
      };

    const mappedSims = useMemo(() => {
      console.log("🔄 [Balance] Generando mappedSims con allSims:", allSims);
      const filtered = allSims
        .filter(sim => {
          const isValid = sim && sim.iccid;
          if (!isValid) console.warn("⚠️ [Balance] SIM inválida en mappedSims:", sim);
          return isValid;
        })
        .map(sim => ({
          id: sim.iccid,
          name: sim.simName || sim.name || "SIM sin nombre",
          logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
          number: sim.iccid,
          provider: sim.provider,
        }));
      console.log("✅ [Balance] mappedSims generados:", filtered.map(s => s.id));
      return filtered;
    }, [allSims]);
           

    const fetchSubscriberData = async (sim: any, uuid: string) => {
    const id = sim.iccid;
    console.log("🔄 [Balance] fetchSubscriberData llamada con:", { id, uuid });
  
    if (!sim || !id) return;
    if (isFetching.current) {
      console.log("⏳ [Balance] Ya se está haciendo fetch");
      return;
    }
  
    if (lastFetchedSimId.current === id) {
      console.log("⚠️ [Balance] Ya se hizo fetch para esta SIM");
      return;
    }
  
    isFetching.current = true;
    lastFetchedSimId.current = id;
  
    try {
      setLoading(true);
      setSimPlans([]);
      await AsyncStorage.setItem("currentICCID", id);
      console.log("💾 [Balance] ICCID guardado en AsyncStorage:", id);
  
      const response = await getSubscriberData(id, uuid);
      console.log("📥 [Balance] Planes recibidos:", response);
  
      const firstProvider = response?.providers?.[0];
      setSimPlans(firstProvider?.plans || []);
    } catch (error) {
      console.error("❌ [Balance] Error al obtener planes:", error);
      setSimPlans([]);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };
  
  const handleDeleteSim = async (iccid: string) => {
    const uuid = await getDeviceUUID();
  
    try {
      setLoading(true);
      setSimPlans([]);
      setSelectedSimId(null);
      await AsyncStorage.removeItem("currentICCID");

      await deleteSubscriber(iccid, uuid);
      console.log(`🗑 [DeleteSim] SIM eliminada: ${iccid}`);
  
      const updatedSims = await listSubscriber(uuid);
      const uniqueSims = Array.isArray(updatedSims)
        ? Array.from(new Map(updatedSims.map((sim: any) => [sim.iccid, sim])).values())
        : [];
  
      dispatch(setSims(uniqueSims));
      console.log(`📦 [DeleteSim] SIMs después de eliminar ${iccid}:`, uniqueSims.map(s => s.iccid));
  
      if (uniqueSims.length === 0) {
        console.warn("❌ [DeleteSim] No quedan SIMs. Redirigiendo a /home");
        await AsyncStorage.removeItem("currentICCID");
        dispatch(resetSimState());
        router.replace("/home");
        return;
      }
  
      const isSelectedSimStillValid = uniqueSims.some(s => s.iccid === selectedSimId);
      const fallbackSim = uniqueSims.find(s => s.provider !== "tottoli");
  
      if (!isSelectedSimStillValid) {
        if (fallbackSim) {
          console.log(`🔁 [DeleteSim] Seleccionando fallback SIM: ${fallbackSim.iccid}`);
          await AsyncStorage.setItem("currentICCID", fallbackSim.iccid);
          dispatch(updateCurrentSim(fallbackSim.iccid));
          setSelectedSimId(fallbackSim.iccid);
          await fetchSubscriberData(fallbackSim, uuid);
        } else {
          console.warn("⚠️ [DeleteSim] Solo quedan SIMs tipo tottoli. Redirigiendo...");
          await AsyncStorage.removeItem("currentICCID");
          dispatch(resetSimState());
          setSelectedSimId(null);
          router.replace("/home");
        }
      }
    } catch (error) {
      console.error("🚨 [DeleteSim] Error eliminando SIM:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (!deviceUUID || !allSims.length) return;
    console.log("📋 [Balance] SIMs disponibles tras eliminación:", allSims.map(s => s.iccid));

    if (!currentSim || currentSim.provider === "tottoli") {
    console.warn("🔄 [Balance] No hay SIM seleccionada válida, eligiendo una automáticamente...");
    const validSim = allSims.find((s) => s.provider !== "tottoli");

    if (validSim) {
      console.log("✅ [Balance] Seleccionando SIM válida:", validSim.iccid);
      dispatch(updateCurrentSim(validSim.iccid));
      fetchSubscriberData(validSim, deviceUUID);
    } else {
      console.warn("❌ [Balance] No hay SIM válida disponible, redirigiendo...");
      dispatch(resetSimState());
      router.replace("/home");
    }
  }
}, [deviceUUID, allSims]);
  

  useEffect(() => {
    const loadUUID = async () => {
      const uuid = await getDeviceUUID();
      setDeviceUUID(uuid);
    };
  
    loadUUID();
  }, []);

  useEffect(() => {
    if (!selectedSimId && currentSim?.iccid) {
      console.log("🎯 [Balance] Reseteando selectedSimId desde currentSim:", currentSim.iccid);
      setSelectedSimId(currentSim.iccid);
    }
  }, [currentSim, selectedSimId]);  
  
  useEffect(() => {
    if (!deviceUUID || !currentSim || currentSim.provider === "tottoli") return;
  
    console.log("📡 [Balance] currentSim actualizado, haciendo fetch:", currentSim.iccid);
    fetchSubscriberData(currentSim, deviceUUID);
  }, [currentSim, deviceUUID]);
  
  
  if (!isLoggedIn) {
    console.log("🔐 [BalanceScreen] Usuario no autenticado, mostrando SignIn");
    return <SignIn />;
  }


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

        <HeaderEncrypted
          owner="encriptados"
          settingsLink="balance/settings/sim?from=balance"
        />

        <ScrollView contentContainerStyle={balanceStyles.content}>
        <SimCurrencySelector
          sims={mappedSims}
          selectedId={selectedSimId}
          onSelectSim={async (id) => {
            console.log("📤 [Balance] onSelectSim invocado con id:", id);
            const sim = allSims.find((s) => s.iccid === id);
            console.log("🔎 [Balance] SIM encontrada en allSims:", sim);
            if (!sim || !deviceUUID) return;

            if (sim.provider === "tottoli") {
              console.warn("⛔️ [Balance] SIM tottoli seleccionada. Redirigiendo...");
              await AsyncStorage.removeItem("currentICCID");
              dispatch(resetSimState());
              setSelectedSimId(null);
              setSimPlans([]);
              router.replace("/home");
              return;
            }

            console.log("🔁 [Balance] SIM válida, haciendo fetch:", sim.iccid);
            await fetchSubscriberData(sim, deviceUUID);
            dispatch(updateCurrentSim(sim.iccid));
            setSelectedSimId(sim.iccid);
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

              if (isNaN(totalMB) || isNaN(usedMB)) {
                console.warn("⚠️ [Balance] Plan inválido:", plan);
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
        <DeleteSimModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={async () => {
            if (selectedSimId) {
              setSimPlans([]);
              setSelectedSimId(null);
              setIsDeleting(true);
              await handleDeleteSim(selectedSimId);
              setIsDeleting(false);
              setShowDeleteModal(false);
            }
          }}
          simName={allSims.find((sim) => sim.iccid === selectedSimId)?.simName}
          isDarkMode={isDarkMode}
          t={t}
          baseMsg="pages.deleteSimModal"
          isDeleting={isDeleting}
        />
      </BackgroundWrapper>
    </>
  );
};

export default BalanceScreen;
