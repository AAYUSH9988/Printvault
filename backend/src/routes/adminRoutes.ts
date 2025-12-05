import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  verifySession,
  getDashboardStats,
  getAdminResources,
  getAdminResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleFeatured,
  bulkDeleteResources,
} from "../controllers/adminController";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// Public routes (no auth required)
router.post("/login", adminLogin);

// Protected routes (auth required)
router.use(authenticateAdmin);

router.post("/logout", adminLogout);
router.get("/verify", verifySession);
router.get("/stats", getDashboardStats);

// Resource CRUD
router.get("/resources", getAdminResources);
router.get("/resources/:id", getAdminResourceById);
router.post("/resources", createResource);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);
router.patch("/resources/:id/featured", toggleFeatured);
router.post("/resources/bulk-delete", bulkDeleteResources);

export default router;
