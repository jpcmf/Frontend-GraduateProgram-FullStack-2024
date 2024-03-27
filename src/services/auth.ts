import axios from "axios";

const strapiUrl = process.env.STRAPI_URL;

export async function signIn({ email, password }: { email: any; password: any }) {
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: email,
    password
  });

  return res.data;
}