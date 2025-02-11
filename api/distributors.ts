import axios from "axios";

export const postForm = async (body) => {
  try {
    const response = await axios.post(
      "https://app.encriptados.io/api/distributor-form",
      body
    );

    return response;
  } catch (error) {
    return error;
  }
};
