import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Formik, FormikProps } from "formik"; // Importa FormikProps
import * as Yup from "yup";
import { useModalPayment } from "@/context/modalpayment";
import IconSvg from "../IconSvg/IconSvg";
import CardMethodIcon from "./icons/CardMethodIcon";
import ATMIcon from "./icons/ATMIcon";
import BancolombiaMethodIcon from "./icons/BancolombiaMethodIcon";
import CryptoIcon from "./icons/CryptoIcon";
import OrderDetails from "./OrderDetails";
import FormPaymentInput from "./FormPaymentInput";
import PaymentOption from "./PaymentOption";
import DividerSection from "./DividerSection";
import PayWithCreditCard from "./PaymentMethodsView/PayWithCreditCard/PayWithCreditCard";
import PayWithAtm from "./PaymentMethodsView/PayWithAtm/PayWithAtm";
import PayWithBancolombia from "./PaymentMethodsView/PayWithBancolombia/PayWithBancolombia";
import { router } from "expo-router";
import { useMenu } from "@/context/menuprovider";

export interface FormValuesPayment {
  email: string;
  telegramId: string;
  shippingName: string;
  shippingAddress: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  creditCardNumber?: string;
}

const ModalPaymentView = () => {
  const { closeModal } = useModalPayment();
  const [activePaymentOption, setPaymentActiveOption] = useState<string | null>(
    null
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingrese un email válido")
      .required("Este campo es obligatorio"),
    telegramId: Yup.string().required("Este campo es obligatorio"),
    shippingName: Yup.string().required("Este campo es obligatorio"),
    shippingAddress: Yup.string().required("Este campo es obligatorio"),
    city: Yup.string().required("Este campo es obligatorio"),
    country: Yup.string().required("Este campo es obligatorio"),
    postalCode: Yup.string().required("Este campo es obligatorio"),
    phone: Yup.string().required("Este campo es obligatorio"),
  });

  const PAYMENTS_METHODS = {
    CREDIT_CARD: "pay_credit_card",
    ATM: "pay_atm",
    BANCOLOMBIA_PAY: "pay_bancolombia",
    CRYPTO: "pay_crypto",
  };

  const paymentOptions = [
    {
      label: "Paga con tarjeta de crédito",
      icon: <CardMethodIcon />,
      value: PAYMENTS_METHODS.CREDIT_CARD,
    },
    { label: "Pagar con ATM", icon: <ATMIcon />, value: PAYMENTS_METHODS.ATM },
    {
      label: "Paga con Bancolombia",
      icon: <BancolombiaMethodIcon />,
      value: PAYMENTS_METHODS.BANCOLOMBIA_PAY,
    },
    {
      label: "Paga con Criptomonedas",
      icon: <CryptoIcon />,
      value: PAYMENTS_METHODS.CRYPTO,
    },
  ];

  let component;

  switch (activePaymentOption) {
    case PAYMENTS_METHODS.CREDIT_CARD:
      component = <PayWithCreditCard />;
      break;
    case PAYMENTS_METHODS.ATM:
      component = <PayWithAtm />;
      break;
    case PAYMENTS_METHODS.BANCOLOMBIA_PAY:
      component = <PayWithBancolombia />;
      break;

    case PAYMENTS_METHODS.CRYPTO:
      component = (
        <Text allowFontScaling={false} style={{ color: "white" }}>
          CRYPTO
        </Text>
      );
      break;
    default:
      component = null;
  }

  const goBack = () => {
    closeModal();
    router.back();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          initialValues={{
            email: "",
            telegramId: "",
            shippingName: "",
            shippingAddress: "",
            city: "",
            country: "",
            postalCode: "",
            phone: "",
            creditCardNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: FormValuesPayment) => {
            closeModal();
          }}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }: FormikProps<FormValuesPayment>) => (
            <View style={{ width: "100%" }}>
              <View style={styles.header}>
                <Text allowFontScaling={false} style={styles.headerTitle}>
                  Detalles de compra
                </Text>
                <TouchableOpacity onPress={goBack}>
                  <IconSvg type="closeicon" />
                </TouchableOpacity>
              </View>
              <OrderDetails />
              {activePaymentOption === PAYMENTS_METHODS.ATM ||
              activePaymentOption ===
                PAYMENTS_METHODS.BANCOLOMBIA_PAY ? null : (
                <View>
                  <DividerSection label="Valor" value="10 USD" />
                  <DividerSection label="Cantidad" value="1" />
                  <DividerSection label="Envío" value="40 USD" />
                  <DividerSection label="Total a pagar" value="50 USD" />
                </View>
              )}

              {activePaymentOption === null ? (
                <View>
                  <View style={styles.inputContainer}>
                    <FormPaymentInput
                      placeholder="Ingresa tu email"
                      handleChange={handleChange("email")}
                      handleBlur={handleBlur("email")}
                      value={values.email}
                      width="48%"
                    />
                    <FormPaymentInput
                      placeholder="ID Telegram"
                      handleChange={handleChange("telegramId")}
                      handleBlur={handleBlur("telegramId")}
                      value={values.telegramId}
                      width="50%"
                    />
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <FormPaymentInput
                      placeholder="Nombre de envío"
                      handleChange={handleChange("shippingName")}
                      handleBlur={handleBlur("shippingName")}
                      value={values.shippingName}
                      width="100%"
                    />
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <FormPaymentInput
                      placeholder="Dirección de envío"
                      handleChange={handleChange("shippingAddress")}
                      handleBlur={handleBlur("shippingAddress")}
                      value={values.shippingAddress}
                      width="100%"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <FormPaymentInput
                      placeholder="Ciudad"
                      handleChange={handleChange("city")}
                      handleBlur={handleBlur("city")}
                      value={values.city}
                      width="48%"
                    />
                    <FormPaymentInput
                      placeholder="País"
                      handleChange={handleChange("country")}
                      handleBlur={handleBlur("country")}
                      value={values.country}
                      width="50%"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <FormPaymentInput
                      placeholder="Código Postal"
                      handleChange={handleChange("postalCode")}
                      handleBlur={handleBlur("postalCode")}
                      value={values.postalCode}
                      width="48%"
                    />
                    <FormPaymentInput
                      placeholder="Teléfono"
                      handleChange={handleChange("phone")}
                      handleBlur={handleBlur("phone")}
                      value={values.phone}
                      width="50%"
                    />
                  </View>
                </View>
              ) : (
                component
              )}
              <View style={styles.paymentOptionsContainer}>
                {activePaymentOption === null
                  ? paymentOptions.map((option, index) => (
                      <PaymentOption
                        key={index}
                        option={option}
                        activeOption={activePaymentOption}
                        setActiveOption={setPaymentActiveOption}
                      />
                    ))
                  : null}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#959595",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  paymentOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

export default ModalPaymentView;
