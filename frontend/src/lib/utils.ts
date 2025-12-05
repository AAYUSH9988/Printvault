import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format category name for display
 */
export function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    bhagwan: "Bhagwan / Deities",
    frames: "Frames & Borders",
    initials: "Couple Initials",
    templates: "Card Templates",
    elements: "Design Elements",
  };
  return labels[category] || category;
}

/**
 * Format file format for display
 */
export function formatFormatLabel(format: string): string {
  const labels: Record<string, string> = {
    pdf: "PDF (Print-ready)",
    cdr: "CDR (CorelDRAW)",
    ai: "AI (Illustrator)",
    svg: "SVG (Vector)",
    eps: "EPS (Vector)",
  };
  return labels[format] || format.toUpperCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}
