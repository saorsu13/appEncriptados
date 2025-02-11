import { create } from "apisauce";

const ENCRIPTADOS_API_URL = "https://encriptados.io/wp-json/api/v1/";

const api = create({
  baseURL: ENCRIPTADOS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
