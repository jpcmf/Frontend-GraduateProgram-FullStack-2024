import { apiClient } from "@/lib/apiClient";

type SignUpData = {
  name: string;
  email: string;
  username: string;
  category: number | undefined;
  city: string;
  uf: string;
  country: string;
  password: string;
  recaptcha?: string;
};

export async function signUpRequest(data: SignUpData) {
  const res = await apiClient.post("/api/auth/local/register", data);
  return res.data;
}
