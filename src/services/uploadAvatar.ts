import { apiClient } from "@/lib/apiClient";

export async function uploadAvatar(formData: FormData, token: string) {
  const res = await apiClient.post("/api/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}
