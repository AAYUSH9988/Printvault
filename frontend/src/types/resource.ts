/**
 * Resource category types
 */
export type ResourceCategory =
  | "bhagwan"
  | "frames"
  | "initials"
  | "templates"
  | "elements";

/**
 * Available file formats
 */
export type FileFormat = "pdf" | "cdr" | "ai" | "svg" | "eps";

/**
 * Resource interface
 */
export interface Resource {
  _id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  tags: string[];
  description: string;
  previewUrl: string;
  drivePdfId?: string;
  driveCdrId?: string;
  driveAiId?: string;
  driveSvgId?: string;
  driveEpsId?: string;
  formats: FileFormat[];
  featured?: boolean;
  downloadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Category with count
 */
export interface CategoryWithCount {
  name: ResourceCategory;
  count: number;
  label: string;
}

/**
 * Tag with count
 */
export interface TagWithCount {
  name: string;
  count: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

/**
 * Resource query parameters
 */
export interface ResourceQueryParams {
  page?: number;
  limit?: number;
  category?: ResourceCategory;
  tag?: string;
  q?: string;
  featured?: boolean;
  sort?: "newest" | "oldest" | "popular" | "title";
}
