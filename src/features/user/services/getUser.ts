import axios from "axios";

import { API } from "@/shared/config/constants";

import type { UserBasics } from "../types/usersBasics.type";

export async function getUser(id: string): Promise<UserBasics> {
  try {
    const res = await axios.get(`${API}/api/users/${id}?populate=avatar,address,category,user_lists`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`);
  }
}
