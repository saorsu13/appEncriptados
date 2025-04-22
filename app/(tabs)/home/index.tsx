import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SignIn from "@/components/organisms/SignIn/SignIn";
import SimCountry from "@/components/organisms/SImCountry/SimCountry";
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

  const [selectedSimIdVisual, setSelectedSimIdVisual] = useState(currentSim?.idSim ?? null);
  const [versionFetched, setVersionFetched] = useState("");
  const [refreshing, setRefreshing] = useState(false);
 
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
        const parsedSims = simsRaw.map((sim) => ({
          idSim: String(sim.iccid),
          simName: sim.name,
          provider: sim.provider,
          iccid: String(sim.iccid),
          code: sim.id ?? 0,
        }));
        console.log("📦 [Home] Lista de SIMs actualizada desde backend:", parsedSims);
        dispatch(setSims(parsedSims));
      }
  
      if (simId) {
        console.log("📲 [Home] SIM pasada por params:", simId);
        dispatch(updateCurrentSim(simId));
        await AsyncStorage.setItem("currentICCID", simId);
      }
    };
  
    syncSimData();
  }, [params?.simId, params?.refetchSims]);

  useEffect(() => {
    const fetchSimsOnly = async () => {
      const uuid = await getDeviceUUID();
      const simsRaw = await listSubscriber(uuid);
      const parsedSims = simsRaw.map((sim) => ({
        idSim: String(sim.iccid),
        simName: sim.name,
        provider: sim.provider,
        iccid: String(sim.iccid),
        code: sim.id ?? 0,
      }));
    
      const isDifferent = JSON.stringify(parsedSims) !== JSON.stringify(sims);
      if (isDifferent) {
        console.log("📦 setSims ejecutado (cambio detectado)");
        dispatch(setSims(parsedSims));
      } else {
        console.log("🟡 SIMs no cambiaron, no se actualiza el store");
      }
    };
    fetchSimsOnly();
  }, []);
    
  useEffect(() => {
    const restoreSimIfNeeded = async () => {
      const storedId = await AsyncStorage.getItem("currentICCID");
      const isValid = sims.some((s) => s.iccid === storedId);
  
      if (!currentSim?.idSim && storedId && isValid) {
        console.log("♻️ Restaurando SIM desde AsyncStorage:", storedId);
        dispatch(updateCurrentSim(storedId));
      } else if (!storedId && sims.length > 0 && !currentSim?.idSim) {
        const fallback = sims[0];
        await AsyncStorage.setItem("currentICCID", fallback.iccid);
        dispatch(updateCurrentSim(fallback.idSim));
        console.log("🆕 No había SIM, asignando por defecto:", fallback.idSim);
      }
    };
  
    if (sims.length && !currentSim?.idSim) {
      restoreSimIfNeeded();
    }
  }, [sims.length, currentSim?.idSim]);
   
  
  useEffect(() => {
    if (!currentSim?.idSim) {
      const restoreSim = async () => {
        const storedSimId = await AsyncStorage.getItem("currentICCID");
        console.log("📦 [Home] Verificando SIM en storage:", storedSimId);
        const simValida = sims.find((s) => s.iccid === storedSimId);
  
        if (storedSimId && simValida) {
          console.log("♻️ [Home] Restaurando SIM válida desde storage:", storedSimId);
          dispatch(updateCurrentSim(storedSimId));
        }
      };
  
      restoreSim();
    }
  }, [currentSim?.idSim, sims]);
  

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
    if (!currentSim) return;
    const payload: BalanceRequest = {
      id: Number(currentSim.idSim),
      country: "CA",
      currencyCode: "CAD",
    };
    console.log("🚀 [Home] Ejecutando mutate con SIM actual:", payload);
    mutation.mutate(payload);
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
    dispatch(updateCurrentSim(newIdSim));
    await AsyncStorage.setItem("currentICCID", newIdSim);
    setSelectedSimIdVisual(newIdSim);
  };  

  if (!isLoggedIn || !currentSim) {
    return <SignIn />;
  }
///////////////////////////////////////////////////////////////////////////

  const onRefresh = () => {
    console.log("🔄 [Home] Refetching balance para SIM:", currentSim?.idSim);
    setRefreshing(true);
  
    if (!currentSim) return;
  
    const payload: BalanceRequest = {
      id: Number(currentSim.idSim),
      country: "CA",
      currencyCode: "CAD",
    };
  
    mutation.mutate(payload, {
      onSettled: () => {
        console.log("✅ [Home] Finalizó refetch");
        setRefreshing(false);
      },
    });
  };
  
  if (!isLoggedIn || !currentSim) {
    console.log("🔐 [Home] Usuario no autenticado o sin SIM, mostrando SignIn");
    return <SignIn />;
  }

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
      <HeaderEncrypted owner="encriptados" settingsLink="/settings-sign" />

      <View style={styles.container}>

        <SimCountry
          sim={selectedSimIdVisual}
          country={"ca-CAD"}
          handleCountry={() => {}}
          onSelectSim={onUserSelectSim}
        />
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
