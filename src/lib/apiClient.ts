import axios from "axios";
import { destroyCookie, parseCookies } from "nookies";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL
});

// Attach token from cookie if the caller has not already set one
apiClient.interceptors.request.use(config => {
  if (!config.headers.Authorization && typeof window !== "undefined") {
    const { "auth.token": token } = parseCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On 401 (expired / invalid token): clear the cookie and send the user to sign-in
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      destroyCookie(undefined, "auth.token");
      // TODO: Handle redirect in Phase 2 with protected layout
      // Router.replace("/auth/signin");
    }
    return Promise.reject(error);
  }
);
