import api from "@/config/api";

async function updateSubstitute(numberSubstitution, id): Promise<any> {
  const response = await api.post("/changeNumberSubstitution", {
    ...numberSubstitution,
    id,
  });

  return response;
}

async function updateDynamicSubstitute(id): Promise<any> {
  const response = await api.post("/changeNumberSubstitutionDinamyc", {
    id,
  });

  return response;
}

export function useChangeSubstitute() {
  const requestManual = async (numberSubstitution, id) => {
    const response = await updateSubstitute(numberSubstitution, id);

    return { data: response.data };
  };

  const requestDynamic = async (id) => {
    const response = await updateDynamicSubstitute(id);

    return { data: response.data };
  };

  return { requestManual, requestDynamic };
}
