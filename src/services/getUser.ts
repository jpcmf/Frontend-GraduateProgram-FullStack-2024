import axios from "axios";

import type { UserBasics } from "@/types/usersBasics.type";
import { API } from "@/utils/constant";

export async function getUser(id: string): Promise<UserBasics> {
  try {
    const res = await axios.get(`${API}/api/users/${id}?populate=avatar,address,category`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`);
  }
}
