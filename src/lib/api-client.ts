import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  if (!API_URL) {
    throw new Error("Backend API URL is missing");
  }

  // Get JWT from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please sign in again.");
  }

  // Attach JWT to request
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(
    `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
    {
      ...options,
      headers,
    },
  );
}