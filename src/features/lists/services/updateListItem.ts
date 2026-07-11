import { apiClient } from "@/shared/api/apiClient";

import type { UpdateListItemPayload } from "../types/lists";

export async function updateListItem(id: string | number, payload: UpdateListItemPayload): Promise<void> {
  const res = await apiClient.put(`/api/user-list-items/${id}`, { data: payload });
  return res.data;
}
