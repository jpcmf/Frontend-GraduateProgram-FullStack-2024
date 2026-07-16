import { apiClient } from "@/shared/api/apiClient";

import type { ListResponse, UpdateListPayload } from "../types/lists";

export async function updateList(id: string | number, payload: UpdateListPayload): Promise<ListResponse> {
  const res = await apiClient.put(`/api/user-lists/${id}`, { data: payload });
  return res.data;
}
