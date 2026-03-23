import axios from "axios";

import type { StoriesResponse } from "@/types/stories";
import { API } from "@/utils/constant";

export async function getStories(): Promise<StoriesResponse> {
  try {
    const res = await axios.get(
      `${API}/api/stories?populate[author][fields][0]=username&populate[author][fields][1]=avatar&populate[author][fields][2]=name`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

export async function getStoriesByUserId(userId: string): Promise<StoriesResponse> {
  try {
    const res = await axios.get(
      `${API}/api/stories?filters[author][id][$eq]=${userId}&populate[author][fields][0]=username&populate[author][fields][1]=avatar`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching stories by user ID:", error);
    throw error;
  }
}
