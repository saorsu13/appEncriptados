import React, { useEffect } from "react";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { RadioButton } from "react-native-paper";
import InputField from "@/components/molecules/InputField/InputFIeld";
import Button from "@/components/atoms/Button/Button";
import { validationSchemaDistributors } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { postForm } from "@/api/distributors";
import useModalAll from "@/hooks/useModalAll";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import { setLoading } from "@/features/loading/loadingSlice";

interface FormValues {
  username: string;
  email: string;
  contactChat: string;
  hasWebsite: "yes" | "no";
  website: string;
  physicalStore: string;
  cities: string;
  hasExperience: "yes" | "no";
  experienceDetails: string;
}

const SignUpDistributors: React.FC = () => {
  const { colors } = useTheme<ThemeCustom>();

  const disptach = useAppDispatch();

  const { showModal } = useModalAll();

  const mutation = useMutation({
    mutationFn: (body: any) => postForm(body),
  });

  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const body = {
      name_or_nickname: values.username,
      email: values.email,
      contact_chat: values.contactChat,
      has_website: values.hasWebsite === "no" ? false : true,
      website_url: values.website ? values.website : "",
      has_physical_store: values.physicalStore ? true : false,
      target_cities: values.cities,
      has_experience: values.hasExperience === "no" ? false : true,
      experience_details: values.experienceDetails,
      lang: "es",
    };

    mutation.mutate(body, {
      onSuccess: (e) => {
        showModal({
          type: "confirm",
          oneButton: true,
          title: "Formluario enviado exitosamente",
          description:
            "El formulario ha sido enviado con éxito. Para finalizar el proceso es necesario que se comunique con nosotros vía telegram: @encriptados y se identifique con el correo registrado en el formulario.",
          textConfirm: t("actions.right"),
          buttonColorConfirm: "#10B4E7",
        });
        resetForm();
      },
      onError: (e) => {
        showModal({
          type: "error",
          oneButton: true,
          title: t("type.error"),
          description: "Se ha producido un error enviando el formulario",
          textConfirm: t("actions.right"),
          buttonColorConfirm: "#CB0808",
        });
      },
    });
  };

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  useEffect(() => {
    if (mutation.isPending && !modalRequiredPassword) {
      disptach(setLoading(true));
    } else {
      disptach(setLoading(false));
    }
  }, [mutation]);

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <HeaderEncrypted iconBack="home-tab/distributors/" />

      <View style={{ flexGrow: 1 }}>
        <View style={{ paddingVertical: 5, paddingHorizontal: 2, gap: 10 }}>
          <Formik
            initialValues={{
              username: "",
              email: "",
              contactChat: "",
              hasWebsite: "no",
              website: "",
              physicalStore: "",
              cities: "",
              hasExperience: "no",
              experienceDetails: "",
            }}
            validationSchema={validationSchemaDistributors}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <InputField
                  placeholder="Nombre o Seudónimo"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                {touched.username && errors.username && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.username}
                  </Text>
                )}

                <InputField
                  placeholder="Correo Electrónico"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.email}
                  </Text>
                )}

                <InputField
                  placeholder="Chat de Contacto (Signal, Telegram, Threema)"
                  onChangeText={handleChange("contactChat")}
                  onBlur={handleBlur("contactChat")}
                  value={values.contactChat}
                />
                {touched.contactChat && errors.contactChat && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.contactChat}
                  </Text>
                )}

                <View style={styles.radioGroup}>
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText }}
                  >
                    ¿Tiene un sitio web?
                  </Text>
                  <RadioButton
                    color={colors.primaryColor}
                    value="yes"
                    status={
                      values.hasWebsite === "yes" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("hasWebsite")("yes")}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText }}
                  >
                    Sí
                  </Text>
                  <RadioButton
                    color={colors.primaryColor}
                    value="no"
                    status={
                      values.hasWebsite === "no" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("hasWebsite")("no")}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText }}
                  >
                    No
                  </Text>
                </View>

                {values.hasWebsite === "yes" && (
                  <InputField
                    placeholder="URL del Sitio Web"
                    onChangeText={handleChange("website")}
                    onBlur={handleBlur("website")}
                    value={values.website}
                  />
                )}
                {touched.website && errors.website && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.website}
                  </Text>
                )}

                <InputField
                  placeholder="¿Posee tienda física? Cuéntenos en qué ubicaciones?"
                  onChangeText={handleChange("physicalStore")}
                  onBlur={handleBlur("physicalStore")}
                  value={values.physicalStore}
                />
                {touched.physicalStore && errors.physicalStore && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.physicalStore}
                  </Text>
                )}

                <InputField
                  placeholder="Ciudades planea vender nuestros servicios"
                  onChangeText={handleChange("cities")}
                  onBlur={handleBlur("cities")}
                  value={values.cities}
                />
                {touched.cities && errors.cities && (
                  <Text allowFontScaling={false} style={{ color: "red" }}>
                    {errors.cities}
                  </Text>
                )}

                <View style={styles.radioGroup}>
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText, width: 220 }}
                  >
                    ¿Tiene experiencia usando o vendiendo sistemas encriptados?
                  </Text>
                  <RadioButton
                    color={colors.primaryColor}
                    value="yes"
                    status={
                      values.hasExperience === "yes" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("hasExperience")("yes")}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText }}
                  >
                    Sí
                  </Text>
                  <RadioButton
                    color={colors.primaryColor}
                    value="no"
                    status={
                      values.hasExperience === "no" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("hasExperience")("no")}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{ color: colors.primaryText }}
                  >
                    No
                  </Text>
                </View>

                {values.hasExperience === "yes" && (
                  <>
                    <InputField
                      placeholder="¿Cuáles?"
                      onChangeText={handleChange("experienceDetails")}
                      onBlur={handleBlur("experienceDetails")}
                      value={values.experienceDetails}
                    />
                    {touched.experienceDetails && errors.experienceDetails && (
                      <Text allowFontScaling={false} style={{ color: "red" }}>
                        {errors.experienceDetails}
                      </Text>
                    )}
                  </>
                )}

                <Button size="small" onClick={handleSubmit}>
                  Enviar formulario
                </Button>
              </>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default SignUpDistributors;
