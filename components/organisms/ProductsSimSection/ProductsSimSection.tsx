import React, { useEffect } from "react";

import { Image, Text, View, StyleSheet } from "react-native";

import Stepper from "@/components/molecules/Stepper/Stepper";
import WhyUse from "../WhyUse/WhyUse";

import SafeCommunityBanner from "../ProductsTab/SafeCommunityBanner/SafeCommunityBanner";
import FAQAccordion from "@/components/molecules/FAQAccordion/FAQAccordion";

import { getFaqs, getProducts } from "@/api/productsTab";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import ListOfProductCards, {
  Product,
} from "@/components/molecules/CardProductItem/ListOfProductCards";
import SkeletonGrid from "@/components/molecules/SkeletonContent/SkeletonGrid";
import WelcomeProducts from "../ProductsTab/WelcomeProducts/WelcomeProducts";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import ActiveVector from "@/components/molecules/Stepper/icons/ActiveVector";
import PricingVector from "@/components/molecules/Stepper/icons/PricingVector";
import ManVector from "@/components/molecules/Stepper/icons/ManVector";
import SimIcon from "@/components/molecules/Stepper/icons/SimIcon";
import CardInfoStepper from "@/components/molecules/Stepper/CardInfoStepper";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";

const ProductsSimSection = () => {
  const BannerWelcome = require("@/assets/images/comunicate-banner.png");
  const BannerSecurity = require("@/assets/images/banner-security.png");

  const currentLanguage = useAppSelector((state) => {
    return state.settings.lang;
  });

  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["faqs", currentLanguage],
    gcTime: 0,
    queryFn: () => getFaqs(currentLanguage),
  });

  const { data: productsSim, isFetching } = useQuery({
    queryKey: ["productsSim"],
    gcTime: 0,
    queryFn: () => getProducts("sim"),
  });

  const Step1Image = require("@/assets/images/step1.png");

  const Step2Image = require("@/assets/images/step2.png");

  const Step3Image = require("@/assets/images/step3.png");

  const { colors } = useTheme<ThemeCustom>();

  const stepData = [
    {
      vectorcomponent: <PricingVector />,
      cardinfo: (
        <CardInfoStepper
          background={colors.white}
          state={<Text>10 USD</Text>}
          imageSource={<SimIcon />}
          title={t("pages.home-tab.encryptedSim")}
        />
      ),
      stepNumber: 1,
      title: t("pages.home-tab.buyIt"),
    },
    {
      vectorcomponent: <ManVector />,
      cardinfo: (
        <CardInfoStepper
          borderColor={colors.success}
          background={colors.white}
          state={
            <>
              <Text allowFontScaling={false} style={{ color: colors.success }}>
                {t("pages.home-tab.received")}
              </Text>
            </>
          }
          imageSource={<SimIcon />}
          title={t("pages.home-tab.encryptedSim")}
        />
      ),
      stepNumber: 2,
      title: t("pages.home-tab.receiveIt"),
    },
    {
      vectorcomponent: <ActiveVector />,
      cardinfo: (
        <CardInfoStepper
          borderColor={colors.primaryColor}
          background={colors.white}
          state={
            <>
              <Text
                allowFontScaling={false}
                style={{ color: colors.primaryColor }}
              >
                {t("pages.home-tab.active")}
              </Text>
            </>
          }
          imageSource={<SimIcon />}
          title={`${t("pages.home-tab.activeSim")}    782903`}
        />
      ),
      stepNumber: 3,
      title: t("pages.home-tab.activateIt"),
    },
  ];

  return (
    <>
      {
        <View style={{ marginBottom: 40 }}>
          <WelcomeProducts
            background={BannerWelcome}
            title={undefined}
            description={t("pages.home-tab.communicate")}
            icon={
              <View
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "#0C3441",
                  borderRadius: 14,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconSvg type="spiral" />
              </View>
            }
          />
        </View>
      }

      <View style={{ marginBottom: 40 }}>
        <Text
          allowFontScaling={false}
          style={{
            color: colors.primaryText,
            fontWeight: "700",
            textAlign: "center",
            fontSize: 18,
            marginBottom: 7,
          }}
        >
          {t("pages.home-tab.encryptedSim")}
        </Text>

        <Text
          allowFontScaling={false}
          style={{
            color: colors.secondaryText,
            fontWeight: "400",
            textAlign: "center",
            fontSize: 14,
            width: 300,

            flex: 1,
            alignSelf: "center",
          }}
        >
          {t("pages.home-tab.securityPrivacy")}
        </Text>
      </View>

      <View>
        {isFetching ? (
          <View style={{ flex: 1, alignSelf: "center" }}>
            <SkeletonGrid
              heightImage={300}
              widthImage={200}
              borderRadius={5}
              gap={12}
              columns={2}
              rows={2}
              boneColor="rgba(255, 255, 255, 0.25)"
            />
          </View>
        ) : Array.isArray(productsSim) && productsSim.length > 0 ? (
          <ListOfProductCards
            heightImage={70}
            widthImage={70}
            list={productsSim as []}
            type={"product"}
          />
        ) : null}
      </View>
      <View style={styles.container}>
        {/* <Carousel
          data={[
            { id: "1", title: "SIM Encriptada", price: "10$ USD" },
            { id: "2", title: "SIM Encriptada 2", price: "20$ USD" },
            { id: "3", title: "SIM Encriptada 3", price: "30$ USD" },
            { id: "4", title: "SIM Encriptada 4", price: "10$ USD" },
            { id: "5", title: "SIM Encriptada 5", price: "20$ USD" },
            { id: "6", title: "SIM Encriptada 6", price: "30$ USD" },
            { id: "7", title: "SIM Encriptada 6", price: "30$ USD" },
          ]}
        /> */}
      </View>

      <View style={{ flex: 1, marginTop: 60, marginBottom: 30, rowGap: 10 }}>
        <Text
          allowFontScaling={false}
          style={{
            color: colors.primaryText,
            fontWeight: "600",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          {t("pages.home-tab.useEasy")}
        </Text>

        <Text
          allowFontScaling={false}
          style={{
            color: colors.secondaryText,
            fontWeight: "400",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {t("pages.home-tab.threeSteps")}
        </Text>
      </View>
      <View>
        <Stepper steps={stepData} />
      </View>

      <View style={{ marginTop: 100, marginBottom: 40 }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: "center",
            textAlign: "center",
            fontWeight: 600,
            color: colors.primaryText,
            fontSize: 24,
            width: 300,
          }}
        >
          {t("pages.home-tab.whyUseEncriptados")}
        </Text>
      </View>

      <WhyUse />

      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <SafeCommunityBanner
          subtitle={t("pages.home-tab.noFrontier")}
          title={t("pages.home-tab.comunicate")}
          description={t("pages.home-tab.200country")}
          icon={undefined}
          background={BannerSecurity}
        />
      </View>

      <View style={{ backgroundColor: "#101010", minHeight: "100%" }}>
        {/* View con background que ocupa todo el espacio restante */}
        {data && <FAQAccordion data={data} />}
      </View>
    </>
  );
};

export default ProductsSimSection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
});
