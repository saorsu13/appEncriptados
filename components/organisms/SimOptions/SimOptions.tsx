import Label from "@/components/atoms/Label/Label";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import theme from "@/config/theme";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import DeleteSimModal from "@/components/molecules/DeleteSimModal";
import ChangeImsi from "../ChangeImsi/ChangeImsi";
import { useDispatch, useSelector } from "react-redux";
import { deleteSim } from "@/features/sims/simSlice";
import { determineType } from "@/utils/utils";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import useModalAll from "@/hooks/useModalAll";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { useAuth } from "@/context/auth";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { deleteSubscriber } from "@/api/subscriberApi";
import { useDeviceUUID } from "@/hooks/useDeviceUUID"; 

const { width } = Dimensions.get("window");

const SimOptions = () => {
  const { themeMode } = useDarkModeTheme();

  const deviceUUID = useDeviceUUID();
  const { colors } = useTheme<ThemeCustom>();
  const options = [
    {
      label: "voiceChange",
      icon: (
        <IconSvg
          color={colors.white}
          type="voicechange"
          height={35}
          width={35}
        />
      ),
      route: "/voice-filter/",
    },
    {
      label: "settings",
      icon: (
        <IconSvg
          color={colors.white}
          type="multiplesettings"
          height={35}
          width={35}
        />
      ),
      route: "/substitute",
    },
    {
      label: "callback",
      icon: (
        <IconSvg color={colors.white} type="callback" height={35} width={35} />
      ),
      route: "/callback",
    },
    {
      label: "imsi",
      icon: (
        <IconSvg color={colors.white} type="change" height={35} width={35} />
      ),
    },
  ];

  const optionsEsim = [
    {
      label: "voiceChange",
      icon: (
        <IconSvg
          color={colors.white}
          type="voicechange"
          height={35}
          width={35}
        />
      ),
      route: "/voice-filter/",
    },
    {
      label: "settings",
      icon: (
        <IconSvg
          color={colors.white}
          type="multiplesettings"
          height={35}
          width={35}
        />
      ),
      route: "/substitute",
    },
    // {
    //   label: "callback",
    //   icon: (
    //     <IconSvg
    //       color={
    //         themeMode === ThemeMode.Dark
    //           ? "#CEEAF4"
    //           : "#093448"
    //       }
    //       type="callback"
    //       height={35}
    //       width={35}
    //     />
    //   ),
    //   route: "/callback",
    // },
  ];

  const { t } = useTranslation();
  const baseMsg = "pages.home.simOptions";
  const [showImsi, setShowImsi] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const currentSim = useSelector((state: any) => state.sims.currentSim);
  const { showModal } = useModalAll();

  const currentBalance = useAppSelector((state) => state.balance);
  const simsLength = useAppSelector((state) => state.sims.sims.length);
  const auth = useAuth();

  const dispatch = useDispatch();

  const handleChangeImsi = (value) => {
    if (currentBalance.balance <= 0) {
      showModal({
        type: "alert",
        oneButton: true,
        title: t("pages.changeImsi.failed.title"),
        description: t("pages.changeImsi.failed.description"),
        textConfirm: t("actions.right"),
        buttonColorConfirm: "#10B4E7",
      });
      return;
    }

    setShowImsi(value);
  };

  const redirectTo = (route: any) => {
    router.push(route);
  };

  const handleDeleteSIm = async () => {
    try {
      const iccid = currentSim?.idSim?.toString();
      const uuid = deviceUUID;
  
      if (!iccid || !uuid) {
        console.warn("❌ ICCID o UUID no disponible para eliminar subscriber");
        return;
      }
  
      console.log(`🧨 Eliminando SIM con ICCID: ${iccid} y UUID: ${uuid}`);
  
      const result = await deleteSubscriber(iccid, uuid);
      console.log("✅ SIM eliminada correctamente:", result);
  
      if (simsLength > 1) {
        dispatch(deleteSim(currentSim.idSim));
      } else {
        auth.signOut();
      }
  
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("❌ Error eliminando la SIM del backend:", error);
      showModal({
        type: "alert",
        oneButton: true,
        title: "Error",
        description: "No se pudo eliminar la SIM en este momento.",
        textConfirm: "OK",
        buttonColorConfirm: "#FF0000",
      });
    }
  };

  return (
    <View style={styles.container}>
      {determineType(currentSim?.idSim) === "physical" ? (
        <View style={styles.containerOptions}>
          {options.map((item) => (
            <TouchableHighlight
              underlayColor={""}
              style={[
                themeMode === ThemeMode.Dark
                  ? styles.itemOption
                  : {
                      ...styles.itemOption,
                      backgroundColor: theme.lightMode.colors.blueDark,
                    },
              ]}
              key={item.label}
              onPress={() =>
                item?.route ? redirectTo(item.route) : handleChangeImsi(true)
              }
            >
              <>
                {item.icon}
                {themeMode === ThemeMode.Dark ? (
                  <Label
                    label={t(`${baseMsg}.${item.label}`)}
                    customStyles={{ textAlign: "center", width: "100%" }}
                  />
                ) : (
                  <Label
                    label={t(`${baseMsg}.${item.label}`)}
                    customStyles={{
                      textAlign: "center",
                      width: "100%",
                      color: theme.lightMode.colors.white,
                    }}
                  />
                )}
              </>
            </TouchableHighlight>
          ))}
        </View>
      ) : (
        // <View>
        //   {optionsEsim.map((item) => (
        //     <TouchableHighlight
        //       underlayColor={""}
        //       style={[styles.itemOptionEsim,themeMode !== ThemeMode.Dark?{backgroundColor:"#cbecf6"}:{}]}
        //       key={item.label}
        //       onPress={() =>
        //         item?.route ? redirectTo(item.route) : handleChangeImsi(true)
        //       }
        //     >
        //       <>
        //         {item.icon}
        //         <Label fixWidth label={t(`${baseMsg}.${item.label}`)} customStyles={themeMode !== ThemeMode.Dark?{color:"#093448"}:{}}/>
        //         <View style={[styles.eSimArrow, themeMode !== ThemeMode.Dark?{borderColor:"#093448"}:{}]}></View>
        //       </>
        //     </TouchableHighlight>
        //   ))}
        // </View>
        <View style={styles.containerOptions}>
          {optionsEsim.map((item) => (
            <TouchableHighlight
              underlayColor={""}
              style={[
                themeMode === ThemeMode.Dark
                  ? styles.itemOption
                  : {
                      ...styles.itemOption,
                      backgroundColor: theme.lightMode.colors.blueDark,
                    },
              ]}
              key={item.label}
              onPress={() =>
                item?.route ? redirectTo(item.route) : handleChangeImsi(true)
              }
            >
              <>
                {item.icon}
                {themeMode === ThemeMode.Dark ? (
                  <Label
                    label={t(`${baseMsg}.${item.label}`)}
                    customStyles={{ textAlign: "center", width: "100%" }}
                  />
                ) : (
                  <Label
                    label={t(`${baseMsg}.${item.label}`)}
                    customStyles={{
                      textAlign: "center",
                      width: "100%",
                      color: theme.lightMode.colors.white,
                    }}
                  />
                )}
              </>
            </TouchableHighlight>
          ))}
        </View>
      )}
      <View style={{ marginTop: 20 }}>
        <TouchableHighlight
          underlayColor={""}
          style={styles.buttonDelete}
          onPress={() => {
            setDeleteModalOpen(!deleteModalOpen);
          }}
        >
          <>
            <IconSvg type="deleteicon" height={20} width={20} />
            <Text allowFontScaling={false} style={styles.buttonDeleteText}>
              {t(`${baseMsg}.delete`)}
            </Text>
          </>
        </TouchableHighlight>
        <DeleteSimModal
          modalVisible={deleteModalOpen}
          closeModal={() => {
            setDeleteModalOpen(!deleteModalOpen);
          }}
          deleteSim={handleDeleteSIm}
        />
        <ChangeImsi
          showChangeImsi={showImsi}
          handleClose={() => handleChangeImsi(false)}
        />
      </View>
    </View>
  );
};

export default SimOptions;

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  containerOptions: {
    display: "flex",
    flexDirection: "row",
    flexWrap: width < 600 ? "wrap" : "nowrap",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  itemOption: {
    alignItems: "center",
    aspectRatio: 1.2,
    width: width < 600 ? width / 2 - 25 : width / 4 - 20,
    backgroundColor: theme.colors.darkBlack01,
    borderRadius: 24,
    display: "flex",
    gap: 15,
    padding: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  itemOptionEsim: {
    backgroundColor: theme.colors.darkBlack01,
    width: "100%",
    borderRadius: 14,
    padding: 20,
    gap: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  eSimArrow: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderRadius: 0,
    width: 15,
    height: 15,
    borderColor: theme.colors.label,
    transform: "rotate(45deg)",
    position: "absolute",
    right: 20,
  },
  buttonDelete: {
    alignItems: "center",
    aspectRatio: 7.3,
    borderRadius: 14,
    display: "flex",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: theme.colors.darkGray01,
    borderWidth: 0.5,
    marginHorizontal: "auto",
    width: "100%",
    color: theme.colors.deleteText,
    opacity: 0.75,
    ...theme.textVariants.textInfo,
  },
  buttonDeleteText: {
    marginLeft: 10,
    color: theme.colors.deleteText,
  },
});
