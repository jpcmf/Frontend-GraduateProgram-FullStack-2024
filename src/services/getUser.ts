import axios from "axios";

import { API } from "@/utils/constant";

export async function getUser(id: string) {
  const res = await axios.get(`${API}/api/users/${id}?populate=avatar,address,category`);

  return res.data;
}
