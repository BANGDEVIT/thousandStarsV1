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

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "auth/login",
      { username, password },
      { withCredentials: true },
    );
    return res.data; // access token
  },

  signOut: async () => {
    return api.post("/auth/logout", { withCredentials: true });
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },
};
