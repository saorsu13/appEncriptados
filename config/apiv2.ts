import { create } from "apisauce";

const ENCRIPTADOS_API_URL_V2 = "https://encriptados.io/wp-json/wp/v2/";

const apiv2 = create({
  baseURL: ENCRIPTADOS_API_URL_V2,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiv2;
