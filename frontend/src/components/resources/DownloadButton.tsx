"use client";

import { Download, FileText, Layers } from "lucide-react";
import type { Resource, FileFormat } from "@/types";
import { getDownloadUrl } from "@/lib/api";
import { formatFormatLabel, cn } from "@/lib/utils";

interface DownloadButtonProps {
  resource: Resource;
  format: FileFormat;
  variant?: "primary" | "secondary";
  className?: string;
}

export function DownloadButton({
  resource,
  format,
  variant = "primary",
  className,
}: DownloadButtonProps) {
  const isAvailable = resource.formats.includes(format);
  const downloadUrl = getDownloadUrl(resource.slug, format);

  const icons: Record<FileFormat, React.ReactNode> = {
    pdf: <FileText className="h-5 w-5" />,
    cdr: <Layers className="h-5 w-5" />,
    ai: <Layers className="h-5 w-5" />,
    svg: <Layers className="h-5 w-5" />,
    eps: <Layers className="h-5 w-5" />,
  };

  if (!isAvailable) {
    return (
      <button
        disabled
        className={cn(
          "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-gray-400 bg-gray-100 cursor-not-allowed",
          className
        )}
      >
        {icons[format]}
        <span>{format.toUpperCase()} Not Available</span>
      </button>
    );
  }

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
        variant === "primary"
          ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90 hover:shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        className
      )}
    >
      <Download className="h-5 w-5" />
      <span>Download {formatFormatLabel(format)}</span>
    </a>
  );
}
