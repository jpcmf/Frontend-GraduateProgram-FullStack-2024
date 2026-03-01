import axios from "axios";

import { API } from "@/utils/constant";

export async function uploadAvatar(formData: FormData, token: string) {
  try {
    const res = await axios.post(`${API}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
