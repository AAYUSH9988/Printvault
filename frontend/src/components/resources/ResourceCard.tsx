import Link from "next/link";
import Image from "next/image";
import { Download, Eye, Star, FileType } from "lucide-react";
import type { Resource } from "@/types";
import { cn, formatCategoryLabel, truncate } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm card-hover",
        className
      )}
    >
      {/* Preview Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <Image
          src={resource.previewUrl}
          alt={resource.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {resource.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-white text-xs font-semibold rounded-full shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}

        {/* Format Badges */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {resource.formats.slice(0, 2).map((format) => (
            <span
              key={format}
              className="px-2 py-1 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold rounded-lg shadow-sm"
            >
              {format.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link
            href={`/resources/${resource.slug}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full text-sm font-semibold hover:bg-[var(--primary-50)] transition-colors shadow-xl"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
          <Link
            href={`/resources/${resource.slug}`}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-full hover:scale-110 transition-transform shadow-xl"
          >
            <Download className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <Link
          href={`/resources?category=${resource.category}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[var(--primary-50)] to-[var(--gold-50)] text-[var(--primary-600)] text-xs font-semibold rounded-full mb-3 hover:from-[var(--primary-100)] hover:to-[var(--gold-100)] transition-colors"
        >
          <FileType className="h-3 w-3" />
          {formatCategoryLabel(resource.category)}
        </Link>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-[var(--primary-600)] transition-colors font-display">
          <Link href={`/resources/${resource.slug}`}>
            {truncate(resource.title, 40)}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {truncate(resource.description, 80)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
            >
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs rounded-lg">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Download className="h-4 w-4" />
            <span className="font-medium">{resource.downloadCount || 0}</span>
          </div>
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] group/link"
          >
            Download
            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
