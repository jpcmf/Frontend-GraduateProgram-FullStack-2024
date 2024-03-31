import axios from "axios";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

type SignInData = {
  email: string;
  password: string;
};

export async function signInRequest({ email, password }: SignInData) {
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: email,
    password
  });

  return res.data;
}

export async function userMe(token: string) {
  const res = await axios.get(`${strapiUrl}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
}
