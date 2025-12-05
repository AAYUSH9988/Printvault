import type { FileFormat } from '../types/resource.js';

/**
 * Google Drive URL helpers
 * 
 * Google Drive provides different URL formats:
 * - View: https://drive.google.com/file/d/{FILE_ID}/view
 * - Download: https://drive.google.com/uc?export=download&id={FILE_ID}
 * - Preview: https://drive.google.com/thumbnail?id={FILE_ID}&sz=w1000
 */

/**
 * Slugify a string for URL-friendly slugs
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}

/**
 * Generate direct download URL from Google Drive file ID
 * @param fileId - Google Drive file ID
 * @returns Direct download URL
 */
export function getDownloadUrl(fileId: string): string {
  if (!fileId) {
    throw new Error('File ID is required');
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Generate view URL from Google Drive file ID
 * @param fileId - Google Drive file ID
 * @returns View URL
 */
export function getViewUrl(fileId: string): string {
  if (!fileId) {
    throw new Error('File ID is required');
  }
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Generate thumbnail/preview URL from Google Drive file ID
 * @param fileId - Google Drive file ID
 * @param size - Image size (default 400px width)
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(fileId: string, size: number = 400): string {
  if (!fileId) {
    throw new Error('File ID is required');
  }
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Extract file ID from various Google Drive URL formats
 * @param url - Google Drive URL
 * @returns File ID or null if not found
 */
export function extractFileId(url: string): string | null {
  if (!url) return null;
  
  // Pattern 1: /file/d/{FILE_ID}/view
  const pattern1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  // Pattern 2: id={FILE_ID}
  const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
  // Pattern 3: /open?id={FILE_ID}
  const pattern3 = /\/open\?id=([a-zA-Z0-9_-]+)/;
  
  const match = url.match(pattern1) || url.match(pattern2) || url.match(pattern3);
  return match ? match[1] : null;
}

/**
 * Get the appropriate Drive file ID from a resource based on format
 * @param resource - Resource object with drive file IDs
 * @param format - Desired file format
 * @returns File ID or null if format not available
 */
export function getDriveFileId(
  resource: {
    drivePdfId?: string;
    driveCdrId?: string;
    driveAiId?: string;
    driveSvgId?: string;
    driveEpsId?: string;
  },
  format: FileFormat
): string | null {
  const formatMap: Record<FileFormat, string | undefined> = {
    pdf: resource.drivePdfId,
    cdr: resource.driveCdrId,
    ai: resource.driveAiId,
    svg: resource.driveSvgId,
    eps: resource.driveEpsId,
  };
  
  return formatMap[format] || null;
}

/**
 * Get MIME type for file format
 * @param format - File format
 * @returns MIME type string
 */
export function getMimeType(format: FileFormat): string {
  const mimeTypes: Record<FileFormat, string> = {
    pdf: 'application/pdf',
    cdr: 'application/octet-stream', // CorelDRAW doesn't have official MIME
    ai: 'application/illustrator',
    svg: 'image/svg+xml',
    eps: 'application/postscript',
  };
  
  return mimeTypes[format] || 'application/octet-stream';
}

export default {
  slugify,
  getDownloadUrl,
  getViewUrl,
  getThumbnailUrl,
  extractFileId,
  getDriveFileId,
  getMimeType,
};
