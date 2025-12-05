import { Request, Response } from 'express';
import { 
  Resource, 
  categoryModelMap, 
  type IResourceDocument 
} from '../models/Resource.js';
import { getDownloadUrl, getDriveFileId } from '../utils/googleDrive.js';
import config from '../config/index.js';
import type { 
  ResourceCategory, 
  FileFormat, 
  ResourceQueryParams,
  ApiResponse,
  PaginatedResponse 
} from '../types/resource.js';

/**
 * Get all resources with pagination and filters
 * GET /api/resources
 */
export async function getAllResources(req: Request, res: Response): Promise<void> {
  try {
    const {
      page = config.pagination.defaultPage,
      limit = config.pagination.defaultLimit,
      category,
      tag,
      q,
      featured,
      sort = 'newest',
    } = req.query as unknown as ResourceQueryParams;

    // Validate and cap limit
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(Math.max(1, Number(limit)), config.pagination.maxLimit);
    const skip = (pageNum - 1) * limitNum;

    // Build query filter
    const filter: Record<string, unknown> = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (featured !== undefined) {
      filter.featured = String(featured) === 'true' || featured === true;
    }
    
    if (q) {
      filter.$text = { $search: q };
    }

    // Build sort option
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { downloadCount: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
    }

    // If category specified, query specific collection
    let resources: unknown[];
    let total: number;

    if (category && categoryModelMap[category]) {
      const Model = categoryModelMap[category];
      [resources, total] = await Promise.all([
        Model.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
        Model.countDocuments(filter),
      ]);
    } else {
      // Query unified collection or aggregate across all
      [resources, total] = await Promise.all([
        Resource.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
        Resource.countDocuments(filter),
      ]);
    }

    const totalPages = Math.ceil(total / limitNum);

    const response = {
      success: true,
      data: resources,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resources',
    } as ApiResponse<null>);
  }
}

/**
 * Get single resource by slug
 * GET /api/resources/:slug
 */
export async function getResourceBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({
        success: false,
        error: 'Slug is required',
      } as ApiResponse<null>);
      return;
    }

    // Try to find in unified collection first
    let resource = await Resource.findOne({ slug }).lean();

    // If not found, search across all category collections
    if (!resource) {
      for (const Model of Object.values(categoryModelMap)) {
        resource = await Model.findOne({ slug }).lean();
        if (resource) break;
      }
    }

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'Resource not found',
      } as ApiResponse<null>);
      return;
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource',
    } as ApiResponse<null>);
  }
}

/**
 * Download resource file
 * GET /api/resources/:slug/download?format=pdf|cdr
 */
export async function downloadResource(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const { format } = req.query;

    if (!slug) {
      res.status(400).json({
        success: false,
        error: 'Slug is required',
      } as ApiResponse<null>);
      return;
    }

    if (!format || !['pdf', 'cdr', 'ai', 'svg', 'eps'].includes(format as string)) {
      res.status(400).json({
        success: false,
        error: 'Valid format is required (pdf, cdr, ai, svg, eps)',
      } as ApiResponse<null>);
      return;
    }

    // Find resource
    let resource = await Resource.findOne({ slug });

    if (!resource) {
      for (const Model of Object.values(categoryModelMap)) {
        resource = await Model.findOne({ slug });
        if (resource) break;
      }
    }

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'Resource not found',
      } as ApiResponse<null>);
      return;
    }

    // Get Drive file ID for requested format
    const fileId = getDriveFileId(resource, format as FileFormat);

    if (!fileId) {
      res.status(404).json({
        success: false,
        error: `Format "${format}" not available for this resource`,
      } as ApiResponse<null>);
      return;
    }

    // Increment download count (fire and forget)
    resource.downloadCount = (resource.downloadCount || 0) + 1;
    resource.save().catch((err: unknown) => console.error('Failed to update download count:', err));

    // Redirect to Google Drive download URL
    const downloadUrl = getDownloadUrl(fileId);
    res.redirect(302, downloadUrl);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process download',
    } as ApiResponse<null>);
  }
}

/**
 * Get related resources (same category or tags)
 * GET /api/resources/:slug/related
 */
export async function getRelatedResources(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const limit = Math.min(Number(req.query.limit) || 4, 10);

    // Find the original resource
    const resource = await Resource.findOne({ slug }).lean() as IResourceDocument | null;

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
      return;
    }

    // Find related by category and tags, excluding current
    const Model = categoryModelMap[resource.category] || Resource;
    
    const related = await Model.find({
      slug: { $ne: slug },
      $or: [
        { category: resource.category },
        { tags: { $in: resource.tags } },
      ],
    })
      .sort({ downloadCount: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: related,
    });
  } catch (error) {
    console.error('Error fetching related resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch related resources',
    } as ApiResponse<null>);
  }
}

/**
 * Get all unique categories with counts
 * GET /api/resources/categories
 */
export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const formattedCategories = categories.map((cat: { _id: string; count: number }) => ({
      name: cat._id,
      count: cat.count,
      label: formatCategoryLabel(cat._id),
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    } as ApiResponse<null>);
  }
}

/**
 * Get all unique tags
 * GET /api/resources/tags
 */
export async function getTags(req: Request, res: Response): Promise<void> {
  try {
    const tags = await Resource.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      success: true,
      data: tags.map((t: { _id: string; count: number }) => ({ name: t._id, count: t.count })),
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tags',
    } as ApiResponse<null>);
  }
}

/**
 * Get featured resources
 * GET /api/resources/featured
 */
export async function getFeaturedResources(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 20);

    const featured = await Resource.find({ featured: true })
      .sort({ downloadCount: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured resources',
    } as ApiResponse<null>);
  }
}

/**
 * Helper: Format category name for display
 */
function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    bhagwan: 'Bhagwan / Deities',
    frames: 'Frames & Borders',
    initials: 'Couple Initials',
    templates: 'Card Templates',
    elements: 'Design Elements',
  };
  return labels[category] || category;
}
