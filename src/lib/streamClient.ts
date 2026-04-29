import { parseCookies } from "nookies";

interface StreamRequestOptions {
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}

/**
 * Thin fetch wrapper for streaming (SSE) responses.
 * Mirrors apiClient.ts conventions: base URL from env, auth token from cookie.
 *
 * Use this instead of bare `fetch` whenever the response is a ReadableStream.
 * For regular JSON responses, use apiClient.
 */
async function post(path: string, { body, headers = {} }: StreamRequestOptions): Promise<Response> {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const authHeaders: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const { "auth.token": token } = parseCookies();
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let message = `Stream request failed: ${response.status}`;
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
    } catch {
      // Response body not JSON — use status message
    }
    throw new Error(message);
  }

  return response;
}

export const streamClient = { post };
