import { apiClient } from "@/shared/api/apiClient";

import type { ListsResponse } from "../types/lists";

const POPULATE =
  "?populate[owner][fields][0]=username" +
  "&populate[owner][fields][1]=name" +
  "&populate[owner][populate][avatar]=true" +
  "&populate[items]=true";

export async function getLists(): Promise<ListsResponse> {
  const res = await apiClient.get(`/api/user-lists${POPULATE}`);
  return res.data;
}
