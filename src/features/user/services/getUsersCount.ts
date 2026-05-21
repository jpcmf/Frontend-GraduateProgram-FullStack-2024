import axios from "axios";

import { API } from "@/shared/config/constants";

export async function getUsersCount() {
  const res = await axios.get(`${API}/api/users/count`);

  return res.data;
}
