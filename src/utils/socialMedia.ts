export function openInstagram(username: string | undefined | null): void {
  if (!username) return;

  const cleanUsername = username.replace("@", "").trim();
  if (!cleanUsername) return;

  window.open(`https://instagram.com/${cleanUsername}`, "_blank", "noopener,noreferrer");
}

export function openWebsite(url: string | undefined | null): void {
  if (!url) return;

  const cleanUrl = url.trim();
  if (!cleanUrl) return;
  
  const fullUrl = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") ? cleanUrl : `https://${cleanUrl}`;

  window.open(fullUrl, "_blank", "noopener,noreferrer");
}
