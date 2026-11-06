import { getMeApi } from "../api/user";

export function useUser() {
  const getMe = async (token: string) => {
    try {
      const result = await getMeApi(token);
      return result;
    } catch (error: any) {
      throw new Error("Error al obtener el usuario");
    }
  };
  return { getMe };
}
