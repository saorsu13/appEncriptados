import axios from "axios";
import { postForm } from "@/api/distributors";

// Mock de axios
jest.mock("axios");

describe("postForm", () => {
  it("should return response data when the request is successful", async () => {
    // Configuración del mock de axios
    const responseData = { data: "response data" };
    axios.post.mockResolvedValue(responseData);

    const body = { key: "value" };
    const response = await postForm(body);

    expect(response).toEqual(responseData);
    expect(axios.post).toHaveBeenCalledWith(
      "https://app.encriptados.io/api/distributor-form",
      body
    );
  });

  it("should return error when the request fails", async () => {
    // Configuración del mock de axios para que devuelva un error
    const error = new Error("Request failed");
    axios.post.mockRejectedValue(error);

    const body = { key: "value" };
    const response = await postForm(body);

    expect(response).toEqual(error);
    expect(axios.post).toHaveBeenCalledWith(
      "https://app.encriptados.io/api/distributor-form",
      body
    );
  });
});
