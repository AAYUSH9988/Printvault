import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

// Extend Express Request to include admin property
declare global {
  namespace Express {
    interface Request {
      admin?: { authenticated: boolean };
    }
  }
}

/**
 * JWT Authentication middleware for admin routes
 */
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies?.adminToken;

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    // Verify JWT token
    const jwtSecret = config.jwtSecret || "default_secret";
    const decoded = jwt.verify(token, jwtSecret) as { admin: boolean };

    if (!decoded.admin) {
      res.status(403).json({
        success: false,
        error: "Admin access required",
      });
      return;
    }

    // Attach admin info to request
    req.admin = { authenticated: true };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token expired",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
}

/**
 * Generate JWT token for admin
 */
export function generateAdminToken(): string {
  const jwtSecret = config.jwtSecret || "default_secret";
  return jwt.sign({ admin: true }, jwtSecret, { expiresIn: "7d" });
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = config.adminPassword;
  return password === adminPassword;
}
