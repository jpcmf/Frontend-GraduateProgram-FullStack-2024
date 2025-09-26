import axios from "axios";
import { API } from "@/utils/constant";

type SignInData = {
  email: string;
  password: string;
};

type UpdateUserData = {
  id: string;
  name: string;
  email: string;
  about: string;
  username: string;
  website_url?: string;
  instagram_url?: string;
};

export async function signInRequest({ email, password }: SignInData) {
  const res = await axios.post(`${API}/api/auth/local`, {
    identifier: email,
    password
  });

  return res.data;
}

export async function userMe(token: string) {
  // use qs library to stringify the url with params
  // npm i qs
  const res = await axios.get(`${API}/api/users/me?populate[avatar][fields][0]=url`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log("res...", res);

  if (!res.data) {
    throw new Error("Failed to fetch user.");
  }

  return res.data;
}

export async function updateUserProfile(token: string, data: UpdateUserData) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("about", data.about);
  formData.append("website_url", data.website_url || "");
  formData.append("instagram_url", data.instagram_url || "");

  const res = await axios.put(`${API}/api/users/${data.id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  if (!res.data) {
    throw new Error("Failed to update user.");
  }

  return res.data;
}
