import { apiClient } from "@/shared/api/apiClient";

export type CreateListItemPayload = {
  name: string;
  description?: string;
  external_url?: string;
  list: number;
  image?: File;
};

export async function createListItem(payload: CreateListItemPayload): Promise<void> {
  if (payload.image) {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: payload.name,
        description: payload.description,
        external_url: payload.external_url,
        list: payload.list
      })
    );
    formData.append("files.image", payload.image);
    await apiClient.post("/api/user-list-items", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  } else {
    await apiClient.post("/api/user-list-items", { data: payload });
  }
}
