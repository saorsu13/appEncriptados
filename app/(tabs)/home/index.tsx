import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SignIn from "@/components/organisms/SignIn/SignIn";
import SimCountry from "@/components/organisms/SimCountry/SimCountry";
import { useAuth } from "@/context/auth";
import { updateCurrentSim } from "@/features/sims/simSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSimBalance } from "@/features/balance/useBalance";
import { BalanceRequest } from "@/features/balance/types";
import { setLoading } from "@/features/loading/loadingSlice";
import BalanceDetails from "@/components/organisms/BalanceDetails/BalanceDetails";
import NetworkProfile from "@/components/organisms/NetworkProfile/NetworkProfile";
import Alert from "@/components/molecules/Alert";
import Label from "@/components/atoms/Label/Label";
import { useTranslation } from "react-i18next";
import SimOptions from "@/components/organisms/SimOptions/SimOptions";
import Skeleton2x2 from "@/components/molecules/SkeletonContent/Skeleton2x2";
import { determineType } from "@/utils/utils";
import { getVersion } from "@/api/version";
import Constants from "expo-constants";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { STORE_URLS } from "@/config/links/allLinks";
import useModalAll from "@/hooks/useModalAll";
import { setHasShownModal } from "@/features/version/versionSlice";
import { RefreshControl } from "react-native";
import { listSubscriber } from "@/api/subscriberApi";
import { getDeviceUUID } from "@/utils/getUUID";
import { setSims } from "@/features/sims/simSlice";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";


const Home = () => {
  console.log("🏠 [Home] Renderizando la vista home");
  const { isLoggedIn } = useAuth();
  const currentSim = useAppSelector((s) => s.sims.currentSim);
  const sims = useAppSelector((s) => s.sims.sims);
  const hasShownModal = useAppSelector((s) => s.version.hasShownModal);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme<ThemeCustom>();
  const { showModal } = useModalAll();
  const baseMsg = "pages.home";
  const params = useLocalSearchParams();

  const [selectedSimIdVisual, setSelectedSimIdVisual] = useState<string | null>(
    currentSim?.idSim ?? null
  );
  const [versionFetched, setVersionFetched] = useState("");
  const [refreshing, setRefreshing] = useState(false);
 
  const [isSimFetchComplete, setIsSimFetchComplete] = useState(false);

  const isSimsReady = sims.length > 0;
  
  useEffect(() => {
    const simId = Array.isArray(params?.simId) ? params.simId[0] : params?.simId;
    const refetchSims = Array.isArray(params?.refetchSims)
      ? params.refetchSims[0]
      : params?.refetchSims;
  
    const syncSimData = async () => {
      if (refetchSims === "true") {
        console.log("🔁 [Home] Refetching SIM list por flag de params");
        const uuid = await getDeviceUUID();
        const simsRaw = await listSubscriber(uuid);
        const parsed = simsRaw.map((sim) => ({
          idSim: String(sim.iccid),
          simName: sim.name,
          provider: sim.provider,
          iccid: String(sim.iccid),
          code: sim.id ?? 0,
        }));
        console.log("📦 [Home] Lista de SIMs actualizada desde backend:", parsed );
        dispatch(setSims(parsed ));
  
      if (simId) {
        const refreshed = parsed.find((s) => s.idSim === simId);
        if (refreshed) {
          console.log("♻️ [Home] Restaurando SIM desde params:", refreshed);
          dispatch(updateCurrentSim(refreshed.idSim));
          await AsyncStorage.setItem("currentICCID", refreshed.idSim);
          setSelectedSimIdVisual(refreshed.idSim);

          if (refreshed.provider === "telco-vision") {
            router.replace({
              pathname: "/balance",
              params: { simId: refreshed.idSim },
            });
            return;
          }
        } else {
          console.warn("🚫 [Home] SIM por params no encontrada en lista actual");
        }
      }
    }

    if (simId && sims.length) {
      const existing = sims.find((s) => s.idSim === simId || s.iccid === simId);
      if (existing) {
        console.log("📲 [Home] SIM pasada por params (sin refetch):", existing);
        dispatch(updateCurrentSim(existing.idSim));
        setSelectedSimIdVisual(existing.idSim);
      } else {
        console.warn("🚫 [Home] SIM no encontrada en lista actual");
      }
    }
  };
  
    syncSimData();
  }, [params?.simId, params?.refetchSims, sims.length]);
  

  useEffect(() => {
    const fetchSims = async () => {
      console.log("🔄 [Home] Forzando fetch de SIMs desde backend");
      const uuid = await getDeviceUUID();
      const simsRaw = await listSubscriber(uuid);

      
      if (!Array.isArray(simsRaw) || simsRaw.length === 0) {
        console.warn("🚫 [Home] No hay SIMs disponibles. Reset del estado y logout");
  
        await AsyncStorage.removeItem("currentICCID");
        dispatch(setSims([]));              
        dispatch(updateCurrentSim(null));   
        setIsSimFetchComplete(true);
        return;
      }
      
      const parsedSims = simsRaw.map((sim) => ({
        idSim: String(sim.iccid),
        simName: sim.name,
        provider: sim.provider,
        iccid: String(sim.iccid),
        code: sim.id ?? 0,
      }));

      console.log("📦 [Home] SIMs seteadas en Redux:", parsedSims.map(s => s.idSim));
      dispatch(setSims(parsedSims));
      console.log("✅ [Home] Ya seteé sims en Redux, marcando isSimFetchComplete");
      setIsSimFetchComplete(true);
    };
  
    fetchSims();
  }, []);

  useEffect(() => {
    const simId = Array.isArray(params?.simId) ? params.simId[0] : params?.simId;
  
    if (!simId || !isSimsReady || !simId.match(/^\d+$/)) return;
  
    const sim = sims.find((s) => s.idSim === simId || s.iccid === simId);
    if (sim) {
      console.log("📲 [Home] SIM pasada por params:", simId);
      dispatch(updateCurrentSim(sim.idSim || sim.iccid));
      AsyncStorage.setItem("currentICCID", simId);
    } else {
      console.warn("🚫 [Home] SIM por params no encontrada en lista actual:", simId);
    }
  }, [params?.simId, isSimsReady]);
  
  useEffect(() => {
    const restoreSimIfNeeded = async () => {
      console.log("🧠 [restoreSimIfNeeded] Evaluando restauración de SIM...");

      if (currentSim?.idSim) {
        console.log("✅ [restoreSimIfNeeded] Ya hay una SIM activa");
        return;
      }
  
      const storedId = await AsyncStorage.getItem("currentICCID");
      console.log("📦 [restoreSimIfNeeded] SIM guardada en AsyncStorage:", storedId);
  
      if (!storedId) {
        console.log("🛑 [restoreSimIfNeeded] No hay SIM guardada");
        return;
      }
  
      const simValida = sims.find((s) => s.iccid === storedId);

      if (simValida?.provider === "tottoli") {
        console.warn("🚫 [restoreSimIfNeeded] SIM tipo 'tottoli' ignorada");
        return;
      }
  
      if (simValida) {
        console.log("♻️ [restoreSimIfNeeded] Restaurando SIM válida:", storedId);
        dispatch(updateCurrentSim(storedId));
        setSelectedSimIdVisual(storedId);
      } else if (sims.length > 0) {
        console.log("❓ [restoreSimIfNeeded] SIM no válida, usando fallback:", sims[0]);
        const fallback = sims.find(s => s.provider !== "tottoli");
        await AsyncStorage.setItem("currentICCID", fallback.iccid);
        dispatch(updateCurrentSim(fallback.idSim));
      }
    };
  
    if (isSimsReady && sims.length && !currentSim?.idSim) {
      console.log("🔍 [Home] Condición para restaurar SIM cumplida ✅");
      restoreSimIfNeeded();
    }else {
      console.log("⏳ [Home] Condición aún no se cumple ❌", {
        isSimsReady,
        simsLength: sims.length,
        hasCurrentSim: !!currentSim?.idSim,
      });
    }
  }, [sims, currentSim?.idSim, isSimsReady]);
  

  const mutation = useMutation({
    mutationFn: getSimBalance,
    onSuccess: (res) => {
      console.log("✅ [Home] Balance API success:", res.data);
      console.log("🔄 [Home] Despachando BALANCE_SUCCESS");
      dispatch(setLoading(false));
    
      const { voice, callback, profile, recommended_profile } = res.data;
    
      if (voice || callback || profile || recommended_profile) {
        dispatch({
          type: "BALANCE_SUCCESS",
          payload: {
            voice,
            callback,
            profile,
            recommended_profile,
          },
        });
      }
    },
    onError: (err) => {
      console.error("❌ [Home] Error al obtener balance:", err);
    },
  });
  
  useEffect(() => {
    if (!currentSim) {
      console.log("🔄 [Home] No hay SIM activa → limpio selección visual");
      setSelectedSimIdVisual(null);
      return;
    }
  
    const id = currentSim.idSim;
    console.log("🚀 [Home] Sincronizando seleccionado:", id);
    setSelectedSimIdVisual(id);
  
    const payload: BalanceRequest = {
      id: Number(currentSim.idSim),
      country: "CA",
      currencyCode: "CAD",
    };
  
    console.log("🚀 [Home] Ejecutando mutate con SIM actual:", payload);
    mutation.mutate(payload);
  }, [currentSim?.idSim]);
  
  useEffect(() => {
    if (currentSim?.provider === "telco-vision") {
      console.log("🚀 [Home] Provider telco-vision detectado → navegando a /balance");
      router.replace({
        pathname: "/balance",
        params: { simId: currentSim.idSim },
      });
    }
  }, [currentSim]);
  
  
const versionQuery = useQuery({
    queryKey: ["getVersion"],
    queryFn: () => getVersion("fantasma"),
    onSuccess: (version) => {
      console.log("📦 [Home] Versión obtenida desde API:", version);
      setVersionFetched(version[0]?.version);
    },
  });

  const areVersionsEqual = useMemo(
    () => Constants.expoConfig.version === versionFetched,
    [versionFetched]
  );

  useEffect(() => {
    if (versionFetched && !hasShownModal && !areVersionsEqual) {
      console.log("🔔 [Home] Mostrando modal de actualización");
      showModal({
        type: "confirm",
        title: t("pages.home-tab.versiontitle"),
        description: t("pages.home-tab.versiondescription") + "?",
        buttonColorConfirm: colors.primaryColor,
        textConfirm: t("pages.home.confirm"),
        textCancel: t("pages.home.cancel"),
        buttonColorCancel: colors.danger,
        onConfirm: async () => {
          const storeUrls = STORE_URLS[Constants.expoConfig.owner] || {};
          const url = storeUrls[Platform.OS];
          if (url && (await Linking.canOpenURL(url))) {
            await Linking.openURL(url);
          }
        },
      });
      dispatch(setHasShownModal(true));
    }
  }, [versionFetched, hasShownModal, areVersionsEqual]);

  
  const onUserSelectSim = async (newIdSim: string) => {
    console.log("📲 [Home] Usuario seleccionó SIM:", newIdSim);

    const simSeleccionada = sims.find((s) => String(s.idSim || s.iccid) === newIdSim);

    if (!simSeleccionada) {
      console.warn("🚫 [Home] SIM seleccionada no encontrada en la lista");
      return;
    }
  
    if (simSeleccionada.provider === "tottoli") {
      console.warn("⛔️ [Home] SIM tipo 'tottoli' seleccionada desde visual. Evitando navegación a /balance");
      router.replace("/home");
      return;
    }

    dispatch(updateCurrentSim(newIdSim));
    await AsyncStorage.setItem("currentICCID", newIdSim);
    setSelectedSimIdVisual(newIdSim);

    console.log("🏁 [Home] Telco-vision seleccionada → navegando a Balance");
   router.replace({
     pathname: "/balance",
     params: { simId: newIdSim }
   });
  };  


  useEffect(() => {
    if (isSimFetchComplete && isLoggedIn && currentSim?.provider === "telco-vision") {
      console.log("🚀 [Home] Condición cumplida → navegando a /balance");
      router.replace({
        pathname: "/balance",
        params: { simId: currentSim.idSim },
      });
    }
  }, [isSimFetchComplete, isLoggedIn, currentSim?.provider, currentSim?.idSim]);


  if (!isSimFetchComplete) {
    console.log("🕐 [Home] Esperando que termine fetch de SIMs...");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00AEEF" />
      </View>
    );
  }
  
  if (!isLoggedIn || !currentSim) {
    console.log("🔐 [Home] Usuario no autenticado o sin SIM, mostrando SignIn");
    return <SignIn />;
  }

  const onRefresh = () => {
    console.log("🔄 [Home] Refetching balance para SIM:", currentSim?.idSim);
    setRefreshing(true);
  
    if (!currentSim || currentSim.provider === "tottoli") return;
  
    const payload: BalanceRequest = {
      id: Number(currentSim.idSim),
      country: "CA",
      currencyCode: "CAD",
    };
    console.log("🚀 [Home] Ejecutando mutate con SIM actual:", payload);
    mutation.mutate(payload, {
      onSettled: () => {
        console.log("✅ [Home] Finalizó refetch");
        setRefreshing(false);
      },
    });
  };

  ///////////////////////////////////////////////////////////////////////////
  return (
    <ScrollView
          style={{ backgroundColor: colors.background }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#999"
            />
          }
        >
      <HeaderEncrypted owner="encriptados" settingsLink="home/settings/sim" />

      <View style={styles.container}>

        {selectedSimIdVisual ? (
          <SimCountry
            sim={selectedSimIdVisual}
            country="ca-CAD"
            handleCountry={() => {}}
            onSelectSim={onUserSelectSim}
          />
        ) : (
          // Aquí podrías mostrar un loader o simplemente nada
          <ActivityIndicator size="small" color="#00AEEF" />
        )}
        {mutation.data && <BalanceDetails data={mutation.data} />}

        <NetworkProfile />

        {mutation.isPending && (
          <Skeleton2x2
            layout={
              determineType(currentSim.idSim) === "physical"
                ? new Array(4).fill({
                    width: "48%",
                    height: 140,
                    marginVertical: 5,
                    borderRadius: 20,
                  })
                : new Array(2).fill({
                    width: "48%",
                    height: 135,
                    marginVertical: 5,
                    borderRadius: 20,
                  })
            }
            containerStyle={{ width: "100%" }}
          />
        )}

        <Alert
          message={t(`${baseMsg}.profileWarning.title`)}
          description={t(`${baseMsg}.profileWarning.description`)}
          type="warning"
          showIcon
        />

        <Label
          fixWidth
          label={t("pages.home.simOptions.title")}
          variant="semiBold"
        />
        <SimOptions />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
