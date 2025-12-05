/**
 * Resource category types
 * Each category maps to a separate collection in MongoDB
 */
export type ResourceCategory = 
  | 'bhagwan'      // Gods/Deities artwork (Ganesh, Lakshmi, etc.)
  | 'frames'       // Decorative frames and borders
  | 'initials'     // Couple initial logos/monograms
  | 'templates'    // Full card templates
  | 'elements';    // Miscellaneous design elements

/**
 * Available file formats
 */
export type FileFormat = 'pdf' | 'cdr' | 'ai' | 'svg' | 'eps';

/**
 * Resource interface - base structure for all print resources
 */
export interface IResource {
  _id?: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  tags: string[];
  description: string;
  
  // Preview image (hosted on ImageKit/Cloudinary or Google Drive)
  previewUrl: string;
  
  // Google Drive file IDs for downloads
  drivePdfId?: string;
  driveCdrId?: string;
  driveAiId?: string;
  driveSvgId?: string;
  driveEpsId?: string;
  
  // Available formats for this resource
  formats: FileFormat[];
  
  // Metadata
  featured?: boolean;
  downloadCount?: number;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
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
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Query parameters for resource listing
 */
export interface ResourceQueryParams {
  page?: number;
  limit?: number;
  category?: ResourceCategory;
  tag?: string;
  q?: string;        // Search query
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'popular' | 'title';
}
