import axios from "axios";

const strapiUrl = process.env.STRAPI_URL;

// export async function signIn({ email, password }) {
//   const response = await fetch(`${strapiUrl}/api/auth/local`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ identifier: email, password }),
//   });
//   return response.json();
// }

export async function signIn({ email, password }: { email: string; password: string }) {
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: email,
    password
  });
  return res.data;
}
