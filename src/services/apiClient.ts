export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const isServer = typeof window === "undefined";

    // Base URL cho server
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000"
      : "http://localhost:3000";

    const fullUrl = isServer ? `${baseUrl}${url}` : url;

    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}
