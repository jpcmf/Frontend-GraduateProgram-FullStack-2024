import { apiClient } from "@/shared/api/apiClient";

export async function linkAvatar(userId: number | string, fileId: number | string, token: string) {
  const res = await apiClient.put(
    `/api/users/${userId}`,
    { avatar: fileId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
}
