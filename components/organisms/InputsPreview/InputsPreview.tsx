import React from "react";
import { View, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "@/components/molecules/InputField/InputFIeld";

import { useTranslation } from "react-i18next";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";

const InputsPreview = () => {
  const { t } = useTranslation();
  const baseMsg = "pages.login.fields";

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validators.required")),
    email: Yup.string().required(t("validators.required")),
    simNumber: Yup.string().required(t("validators.required")),
    simLabel: Yup.string().required(t("validators.required")),
  });

  const handleSubmit = (values) => {};

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      simNumber: "",
      simLabel: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <View style={styles.container}>
      <InputField
        label={t(`${baseMsg}.name.label`)}
        onChangeText={formik.handleChange("email")}
        handleBlur={formik.handleBlur("email")}
        value={formik.values.email}
        error={formik.touched.email ? formik.errors.email : null}
        required={true}
        placeholder={t(`${baseMsg}.name.placeholder`)}
      />

      <InputField
        label={t(`${baseMsg}.sim.label`)}
        onChangeText={formik.handleChange("name")}
        handleBlur={formik.handleBlur("name")}
        value={formik.values.name}
        error={formik.touched.name ? formik.errors.name : null}
        required={true}
        placeholder={t(`${baseMsg}.sim.placeholder`)}
        suffixIcon={<IconSvg height={50} width={50} type="info" />}
      />

      <InputField
        label={t(`${baseMsg}.sim.label`)}
        onChangeText={formik.handleChange("simLabel")}
        handleBlur={formik.handleBlur("simLabel")}
        value={formik.values.simLabel}
        error={formik.touched.simLabel ? formik.errors.simLabel : null}
        required={true}
        placeholder={t(`${baseMsg}.sim.placeholder`)}
        prefixIcon={<IconSvg height={50} width={50} type="info" />}
        suffixIcon={<IconSvg height={50} width={50} type="info" />}
      />

      <InputField
        label={t(`${baseMsg}.sim.label`)}
        onChangeText={formik.handleChange("simNumber")}
        handleBlur={formik.handleBlur("simNumber")}
        value={formik.values.simNumber}
        error={formik.touched.simNumber ? formik.errors.simNumber : null}
        required={true}
        placeholder={t(`${baseMsg}.sim.placeholder`)}
        prefixIcon={<IconSvg height={50} width={50} type="sim" />}
        variant="light"
      />
    </View>
  );
};

export default InputsPreview;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
