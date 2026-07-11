import { apiClient } from "@/shared/api/apiClient";

import type { ListsResponse } from "../types/lists";

export async function getListsByUser(userId: string | number): Promise<ListsResponse> {
  const res = await apiClient.get(
    `/api/user-lists?filters[owner][$eq]=${userId}&populate[items]=true`
  );
  return res.data;
}
