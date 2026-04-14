import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { linkAvatar } from "@/services/linkAvatar";
import { uploadAvatar } from "@/services/uploadAvatar";

export function useAvatarUpload() {
  const { token } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadAvatar = async (file: File, userId: number | string): Promise<void> => {
    if (!token) throw new Error("Token de autenticação não encontrado");

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", String(userId));
      formData.append("field", "avatar");

      const uploaded = await uploadAvatar(formData, token);
      const fileId = uploaded[0]?.id;

      if (!fileId) throw new Error("Upload failed: no file ID returned");

      await linkAvatar(userId, fileId, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { handleUploadAvatar, isUploading, error };
}
