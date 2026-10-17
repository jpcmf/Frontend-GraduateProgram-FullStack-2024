import { apiClient } from "@/shared/api/apiClient";

export async function getUsersCount() {
  const res = await apiClient.get("/api/users/count");

  return res.data;
}
