import type { Resource, PaginatedResponse, ApiResponse } from "@/types";
import { getAuthToken } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Admin API client with authentication
 */
async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

/**
 * Dashboard stats
 */
export interface DashboardStats {
  totalResources: number;
  featuredCount: number;
  totalDownloads: number;
  categoryStats: { category: string; count: number }[];
  recentResources: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    createdAt: string;
  }[];
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return adminFetch<ApiResponse<DashboardStats>>("/api/admin/stats");
}

/**
 * Get admin resources with pagination
 */
export async function getAdminResources(params?: {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
}): Promise<PaginatedResponse<Resource>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.category) searchParams.set("category", params.category);
  if (params?.q) searchParams.set("q", params.q);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<Resource>>(
    `/api/admin/resources${query ? `?${query}` : ""}`
  );
}

/**
 * Get single resource by ID
 */
export async function getAdminResourceById(
  id: string
): Promise<ApiResponse<Resource>> {
  return adminFetch<ApiResponse<Resource>>(`/api/admin/resources/${id}`);
}

/**
 * Create resource
 */
export interface CreateResourceData {
  title: string;
  category: string;
  description: string;
  tags?: string[];
  previewUrl?: string;
  drivePdfId?: string;
  driveCdrId?: string;
  driveAiId?: string;
  driveSvgId?: string;
  driveEpsId?: string;
  featured?: boolean;
}

export async function createResource(
  data: CreateResourceData
): Promise<ApiResponse<Resource>> {
  return adminFetch<ApiResponse<Resource>>("/api/admin/resources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update resource
 */
export async function updateResource(
  id: string,
  data: Partial<CreateResourceData>
): Promise<ApiResponse<Resource>> {
  return adminFetch<ApiResponse<Resource>>(`/api/admin/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete resource
 */
export async function deleteResource(
  id: string
): Promise<ApiResponse<null>> {
  return adminFetch<ApiResponse<null>>(`/api/admin/resources/${id}`, {
    method: "DELETE",
  });
}

/**
 * Toggle featured status
 */
export async function toggleFeatured(
  id: string
): Promise<ApiResponse<{ featured: boolean }>> {
  return adminFetch<ApiResponse<{ featured: boolean }>>(
    `/api/admin/resources/${id}/featured`,
    { method: "PATCH" }
  );
}

/**
 * Bulk delete resources
 */
export async function bulkDeleteResources(
  ids: string[]
): Promise<ApiResponse<{ deletedCount: number }>> {
  return adminFetch<ApiResponse<{ deletedCount: number }>>(
    "/api/admin/resources/bulk-delete",
    {
      method: "POST",
      body: JSON.stringify({ ids }),
    }
  );
}
