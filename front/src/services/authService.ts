import api from "@/lib/axios";

export const authService = {
  signUp: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) => {
    const res = await api.post(
      "/auth/register",
      { email, password, phone, firstName, lastName },
      { withCredentials: true },
    );
    return res.data;
  },
  signIn: async (email: string, password: string) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
    return res.data.data;
  },
  signOut: async () => {
    return api.post("/auth/logout", { withCredentials: true });
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },
};
