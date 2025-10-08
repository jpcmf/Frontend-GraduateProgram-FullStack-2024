import axios from "axios";

import { API } from "@/utils/constant";

export async function getUsersCount() {
  const res = await axios.get(`${API}/api/users/count`);

  return res.data;
}
