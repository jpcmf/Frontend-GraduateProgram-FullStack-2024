import axios from "axios";
import { API } from "@/utils/constant";

type SignInData = {
  email: string;
  password: string;
};

export async function signInRequest({ email, password }: SignInData) {
  const res = await axios.post(`${API}/api/auth/local`, {
    identifier: email,
    password
  });

  return res.data;
}

export async function userMe(token: string) {
  const res = await axios.get(`${API}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
}
