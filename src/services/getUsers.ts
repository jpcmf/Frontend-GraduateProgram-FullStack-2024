import axios from "axios";

import { API } from "@/utils/constant";

export async function getUsers() {
  const res = await axios.get(`${API}/api/users?populate=avatar,address`);

  return res.data;
}

export async function getUsers2(currentPage?: number, pageSize?: number) {
  if (currentPage === undefined) currentPage = 1;
  if (pageSize === undefined) pageSize = 10;

  const res = await axios.get(
    `${API}/api/users?populate=avatar,address&start=${currentPage * pageSize}&limit=${pageSize}`
  );

  return res.data;
}

export async function getCustomUsersWithPagination(currentPage?: number, pageSize?: number) {
  const res = await axios.get(
    `${API}/api/custom-users?populate[0]=address&populate[1]=avatar&populate[2]=category&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`
  );

  return res.data;
}
