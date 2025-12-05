import type {
  Resource,
  CategoryWithCount,
  TagWithCount,
  PaginatedResponse,
  ApiResponse,
  ResourceQueryParams,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Get all resources with pagination and filters
 */
export async function getResources(
  params?: ResourceQueryParams
): Promise<PaginatedResponse<Resource>> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.category) searchParams.set("category", params.category);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.q) searchParams.set("q", params.q);
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  const endpoint = `/api/resources${query ? `?${query}` : ""}`;
  
  return fetchAPI<PaginatedResponse<Resource>>(endpoint, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
}

/**
 * Get single resource by slug
 */
export async function getResourceBySlug(
  slug: string
): Promise<ApiResponse<Resource>> {
  return fetchAPI<ApiResponse<Resource>>(`/api/resources/${slug}`, {
    next: { revalidate: 60 },
  });
}

/**
 * Get related resources
 */
export async function getRelatedResources(
  slug: string,
  limit = 4
): Promise<ApiResponse<Resource[]>> {
  return fetchAPI<ApiResponse<Resource[]>>(
    `/api/resources/${slug}/related?limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

/**
 * Get all categories with counts
 */
export async function getCategories(): Promise<ApiResponse<CategoryWithCount[]>> {
  return fetchAPI<ApiResponse<CategoryWithCount[]>>("/api/resources/categories", {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
}

/**
 * Get all tags
 */
export async function getTags(): Promise<ApiResponse<TagWithCount[]>> {
  return fetchAPI<ApiResponse<TagWithCount[]>>("/api/resources/tags", {
    next: { revalidate: 300 },
  });
}

/**
 * Get featured resources
 */
export async function getFeaturedResources(
  limit = 8
): Promise<ApiResponse<Resource[]>> {
  return fetchAPI<ApiResponse<Resource[]>>(
    `/api/resources/featured?limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

/**
 * Get download URL for a resource
 */
export function getDownloadUrl(slug: string, format: string): string {
  return `${API_URL}/api/resources/${slug}/download?format=${format}`;
}
