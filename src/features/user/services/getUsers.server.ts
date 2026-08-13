import type { UserBasicsWithPagination } from "../types/UserBasicsWithPagination.type";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getUsersServer(
  currentPage = 1,
  pageSize = 50
): Promise<{ users: UserBasicsWithPagination; totalFetchedUsers: number }> {
  const usersUrl =
    `${API}/api/custom-users` +
    "?populate[0]=address&populate[1]=avatar&populate[2]=category" +
    `&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
  const countUrl = `${API}/api/users/count`;

  const [usersRes, countRes] = await Promise.all([
    fetch(usersUrl, { next: { revalidate: 60 } }),
    fetch(countUrl, { next: { revalidate: 60 } })
  ]);

  if (!usersRes.ok || !countRes.ok) {
    throw new Error("Failed to fetch users");
  }

  const users: UserBasicsWithPagination = await usersRes.json();
  const totalFetchedUsers: number = await countRes.json();

  return { users, totalFetchedUsers };
}