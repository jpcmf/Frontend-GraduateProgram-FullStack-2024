import { apiClient } from "@/shared/api/apiClient";

import type { CreateListPayload, ListResponse } from "../types/lists";

export async function createList(payload: CreateListPayload): Promise<ListResponse> {
  const res = await apiClient.post("/api/user-lists", { data: payload });
  return res.data;
}
