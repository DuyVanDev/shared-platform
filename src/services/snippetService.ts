// services/snippetService.ts

import { apiFetch } from "./apiClient";

interface FetchSnippetsParams {
  page?: number;
  limit?: number;
  query?: string;
  language?: string;
  tag?: string;
}

export const fetchSnippets = async (params: {
  page: number;
  limit: number;
  q?: string;
  tag?: string;
  language?: string;
}) => {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  if (params.q) query.append("q", params.q);
  if (params.tag) query.append("tag", params.tag);
  if (params.language) query.append("language", params.language);

  return apiFetch(`/api/snippets?${query.toString()}`);
};
export async function fetchSnippetById(id: string) {
  return apiFetch(`/api/snippets/${id}`);
}

export async function fetchMySnippets(params: { page: number; limit: number }) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  return apiFetch(`/api/snippets/me?${query.toString()}`);
}

interface SnippetPayload {
  title: string;
  code: string;
  language: string;
  topics?: string[];
  description?: string;
  isPublic?: boolean;
}

export async function createSnippet(payload: SnippetPayload) {
  return apiFetch("/api/snippets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSnippet(id: string, payload: SnippetPayload) {
  return apiFetch(`/api/snippets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSnippet(id: string) {
  return apiFetch(`/api/snippets/${id}`, {
    method: "DELETE",
  });
}
