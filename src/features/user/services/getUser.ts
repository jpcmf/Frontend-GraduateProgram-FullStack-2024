import { apiClient } from "@/shared/api/apiClient";

import type { UserBasics } from "../types/usersBasics.type";

export async function getUser(id: string): Promise<UserBasics> {
  try {
    const res = await apiClient.get(`/api/users/${id}?populate=avatar,address,category,user_lists`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`);
  }
}
