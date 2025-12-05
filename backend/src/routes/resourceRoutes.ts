import { Router } from 'express';
import {
  getAllResources,
  getResourceBySlug,
  downloadResource,
  getRelatedResources,
  getCategories,
  getTags,
  getFeaturedResources,
} from '../controllers/resourceController.js';

const router = Router();

/**
 * Resource Routes
 * Base path: /api/resources
 */

// GET /api/resources - List all resources with pagination & filters
router.get('/', getAllResources);

// GET /api/resources/categories - Get all categories with counts
router.get('/categories', getCategories);

// GET /api/resources/tags - Get all unique tags
router.get('/tags', getTags);

// GET /api/resources/featured - Get featured resources
router.get('/featured', getFeaturedResources);

// GET /api/resources/:slug - Get single resource by slug
router.get('/:slug', getResourceBySlug);

// GET /api/resources/:slug/download - Download resource file
router.get('/:slug/download', downloadResource);

// GET /api/resources/:slug/related - Get related resources
router.get('/:slug/related', getRelatedResources);

export default router;
