import { apiClient } from "@/shared/api/apiClient";

import type { ListResponse } from "../types/lists";

const POPULATE =
  "?populate[owner][fields][0]=username" +
  "&populate[owner][fields][1]=name" +
  "&populate[owner][populate][avatar]=true" +
  "&populate[items]=true";

export async function getListById(id: string | number): Promise<ListResponse> {
  const res = await apiClient.get(`/api/user-lists/${id}${POPULATE}`);
  return res.data;
}
