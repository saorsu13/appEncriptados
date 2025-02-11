import * as Yup from "yup";

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/[\w-]*)*$/;

export const validationSchemaDistributors = Yup.object().shape({
  username: Yup.string().required("El nombre de usuario es obligatorio"),
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  contactChat: Yup.string().required("El chat de contacto es obligatorio"),
  hasWebsite: Yup.string().required("Seleccione si tiene un website"),
  website: Yup.string()
    .matches(urlRegex, "Ingrese una URL válida")
    .when("hasWebsite", {
      is: (val: string) => val === "yes",
      then: (schema) => schema.required("La URL del website es obligatoria"),
    }),
  physicalStore: Yup.string().required(
    "Indique si posee tienda física y en qué ubicaciones"
  ),
  cities: Yup.string().required(
    "Indique en qué ciudades planea vender nuestros servicios"
  ),
  hasExperience: Yup.string().required(
    "Seleccione si tiene experiencia con sistemas encriptados"
  ),

  experienceDetails: Yup.string().when("hasExperience", {
    is: (val: string) => val === "yes",
    then: (schema) =>
      schema.required("Indique cuáles sistemas encriptados ha usado o vendido"),
  }),
});
