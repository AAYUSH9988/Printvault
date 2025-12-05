import { Request, Response } from "express";
import { Resource } from "../models";
import {
  generateAdminToken,
  verifyAdminPassword,
} from "../middleware/auth";
import { slugify } from "../utils/googleDrive";

/**
 * Admin login
 * POST /api/admin/login
 */
export async function adminLogin(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        error: "Password is required",
      });
      return;
    }

    if (!verifyAdminPassword(password)) {
      res.status(401).json({
        success: false,
        error: "Invalid password",
      });
      return;
    }

    const token = generateAdminToken();

    // Set httpOnly cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: { token },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
}

/**
 * Admin logout
 * POST /api/admin/logout
 */
export async function adminLogout(_req: Request, res: Response): Promise<void> {
  res.clearCookie("adminToken");
  res.json({
    success: true,
    message: "Logout successful",
  });
}

/**
 * Verify admin session
 * GET /api/admin/verify
 */
export async function verifySession(
  req: Request,
  res: Response
): Promise<void> {
  // If middleware passed, session is valid
  res.json({
    success: true,
    data: { authenticated: true },
  });
}

/**
 * Get dashboard stats
 * GET /api/admin/stats
 */
export async function getDashboardStats(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const [
      totalResources,
      featuredCount,
      categoryStats,
      totalDownloads,
      recentResources,
    ] = await Promise.all([
      Resource.countDocuments(),
      Resource.countDocuments({ featured: true }),
      Resource.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Resource.aggregate([
        { $group: { _id: null, total: { $sum: "$downloadCount" } } },
      ]),
      Resource.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug category createdAt"),
    ]);

    res.json({
      success: true,
      data: {
        totalResources,
        featuredCount,
        categoryStats: categoryStats.map((cat) => ({
          category: cat._id,
          count: cat.count,
        })),
        totalDownloads: totalDownloads[0]?.total || 0,
        recentResources,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard stats",
    });
  }
}

/**
 * Get all resources for admin (with more details)
 * GET /api/admin/resources
 */
export async function getAdminResources(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const search = req.query.q as string;

    // Build query
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resource.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: resources,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get admin resources error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resources",
    });
  }
}

/**
 * Get single resource by ID for admin
 * GET /api/admin/resources/:id
 */
export async function getAdminResourceById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        error: "Resource not found",
      });
      return;
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Get admin resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resource",
    });
  }
}

/**
 * Create new resource
 * POST /api/admin/resources
 */
export async function createResource(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      title,
      category,
      description,
      tags,
      previewUrl,
      drivePdfId,
      driveCdrId,
      driveAiId,
      driveSvgId,
      driveEpsId,
      featured,
    } = req.body;

    // Validate required fields
    if (!title || !category || !description) {
      res.status(400).json({
        success: false,
        error: "Title, category, and description are required",
      });
      return;
    }

    // Generate slug
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Resource.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Determine available formats
    const formats: string[] = [];
    if (drivePdfId) formats.push("pdf");
    if (driveCdrId) formats.push("cdr");
    if (driveAiId) formats.push("ai");
    if (driveSvgId) formats.push("svg");
    if (driveEpsId) formats.push("eps");

    const resource = new Resource({
      title,
      slug,
      category,
      description,
      tags: tags || [],
      previewUrl: previewUrl || "",
      drivePdfId,
      driveCdrId,
      driveAiId,
      driveSvgId,
      driveEpsId,
      formats,
      featured: featured || false,
      downloadCount: 0,
    });

    await resource.save();

    res.status(201).json({
      success: true,
      data: resource,
      message: "Resource created successfully",
    });
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create resource",
    });
  }
}

/**
 * Update resource
 * PUT /api/admin/resources/:id
 */
export async function updateResource(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find existing resource
    const resource = await Resource.findById(id);
    if (!resource) {
      res.status(404).json({
        success: false,
        error: "Resource not found",
      });
      return;
    }

    // If title changed, update slug
    if (updates.title && updates.title !== resource.title) {
      const baseSlug = slugify(updates.title);
      let slug = baseSlug;
      let counter = 1;

      while (await Resource.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = slug;
    }

    // Recalculate formats if file IDs changed
    const formats: string[] = [];
    const pdfId = updates.drivePdfId ?? resource.drivePdfId;
    const cdrId = updates.driveCdrId ?? resource.driveCdrId;
    const aiId = updates.driveAiId ?? resource.driveAiId;
    const svgId = updates.driveSvgId ?? resource.driveSvgId;
    const epsId = updates.driveEpsId ?? resource.driveEpsId;

    if (pdfId) formats.push("pdf");
    if (cdrId) formats.push("cdr");
    if (aiId) formats.push("ai");
    if (svgId) formats.push("svg");
    if (epsId) formats.push("eps");
    updates.formats = formats;

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedResource,
      message: "Resource updated successfully",
    });
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update resource",
    });
  }
}

/**
 * Delete resource
 * DELETE /api/admin/resources/:id
 */
export async function deleteResource(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        error: "Resource not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete resource",
    });
  }
}

/**
 * Toggle featured status
 * PATCH /api/admin/resources/:id/featured
 */
export async function toggleFeatured(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      res.status(404).json({
        success: false,
        error: "Resource not found",
      });
      return;
    }

    resource.featured = !resource.featured;
    await resource.save();

    res.json({
      success: true,
      data: { featured: resource.featured },
      message: `Resource ${resource.featured ? "marked as" : "removed from"} featured`,
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle featured status",
    });
  }
}

/**
 * Bulk delete resources
 * POST /api/admin/resources/bulk-delete
 */
export async function bulkDeleteResources(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        error: "Resource IDs array is required",
      });
      return;
    }

    const result = await Resource.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `${result.deletedCount} resources deleted`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete resources",
    });
  }
}
