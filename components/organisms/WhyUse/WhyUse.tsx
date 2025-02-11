import AntenaInfo from "@/components/molecules/CardInfo/icons/AntenaInfo";
import CardInfo from "@/components/molecules/CardInfo/CardInfo";

import React from "react";
import { Text } from "react-native";
import ClockSigne from "@/components/molecules/CardInfo/icons/ClockSigne";
import World from "@/components/molecules/CardInfo/icons/World";
import Chip from "@/components/molecules/CardInfo/icons/Chip";
import Phone from "@/components/molecules/CardInfo/icons/Phone";
import SecurityUnlock from "@/components/molecules/CardInfo/icons/SecurityUnlock";
import Question from "@/components/molecules/CardInfo/icons/Question";
import { t } from "i18next";

const WhyUse = () => {
  return (
    <>
      <CardInfo
        title={t("pages.home-tab.noMSI")}
        vectorComponent={<AntenaInfo />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.noLimit")}
        vectorComponent={<ClockSigne />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.simEconomy")}
        vectorComponent={<World />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.locationSIM")}
        vectorComponent={<Chip />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.noHistory")}
        vectorComponent={<Phone />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.anonimateSIM")}
        vectorComponent={<SecurityUnlock />}
        descriptionColor="#B1B1B1"
      />

      <CardInfo
        title={t("pages.home-tab.simAlt")}
        vectorComponent={<Question />}
        descriptionColor="#B1B1B1"
      />
    </>
  );
};

export default WhyUse;
