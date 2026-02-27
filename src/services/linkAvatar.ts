import axios from "axios";

import { API } from "@/utils/constant";

export async function linkAvatar(userId: number | string, fileId: number | string, token: string) {
  try {
    const res = await axios.put(
      `${API}/api/users/${userId}`,
      {
        avatar: fileId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
