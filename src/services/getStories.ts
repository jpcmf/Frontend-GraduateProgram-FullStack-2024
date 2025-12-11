import axios from "axios";

import { API } from "@/utils/constant";

export async function getStories() {
  const res = await axios.get(
    `${API}/api/stories?populate[author][fields][0]=username&populate[author][fields][1]=avatar`
  );

  return res.data;
}

export async function getStoriesByUserId(userId: string) {
  const res = await axios.get(
    `${API}/api/stories?filters[author][id][$eq]=${userId}&populate[author][fields][0]=username&populate[author][fields][1]=avatar`
  );

  return res.data;
}
