import { apiClient } from "@/lib/apiClient";

type SignInData = {
  email: string;
  password: string;
};

type Category = {
  id: number;
  name: string;
  value?: string;
};

type UpdateUserData = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: Category;
  about: string;
  website_url?: string;
  instagram_url?: string;
};

export async function signInRequest({ email, password }: SignInData) {
  const res = await apiClient.post("/api/auth/local", {
    identifier: email,
    password
  });

  return res.data;
}

export async function userMe(token: string) {
  const res = await apiClient.get("/api/users/me?populate[avatar][fields][0]=url", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.data) {
    throw new Error("Failed to fetch user.");
  }

  return res.data;
}

export async function updateUserProfile(token: string, data: UpdateUserData) {
  const payload = {
    name: data.name,
    email: data.email,
    username: data.username,
    category: data.category.id,
    about: data.about,
    website_url: data.website_url || "",
    instagram_url: data.instagram_url || ""
  };

  const res = await apiClient.put(`/api/users/${data.id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.data) {
    throw new Error("Failed to update user.");
  }

  return res.data;
}
