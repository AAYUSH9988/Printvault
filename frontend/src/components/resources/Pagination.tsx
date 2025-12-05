"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { PaginationMeta } from "@/types";
import { cn } from "@/lib/utils";

interface PaginationProps {
  meta: PaginationMeta;
  className?: string;
}

export function Pagination({ meta, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const { page, totalPages, hasNextPage, hasPrevPage, total } = meta;

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    return `/resources?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (page > 3) pages.push("...");
    
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    
    if (page < totalPages - 2) pages.push("...");
    
    pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm", className)}>
      {/* Info */}
      <p className="text-sm text-slate-500 font-medium">
        Showing page <span className="text-[var(--primary-600)] font-bold">{page}</span> of{" "}
        <span className="text-slate-700 font-bold">{totalPages}</span>{" "}
        <span className="text-slate-400">({total} resources)</span>
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        {hasPrevPage ? (
          <Link
            href={createPageUrl(page - 1)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-[var(--primary-100)] text-slate-600 hover:text-[var(--primary-600)] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <span className="p-2.5 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed">
            <ChevronLeft className="h-5 w-5" />
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === "..." ? (
              <span key={`dots-${idx}`} className="px-2 py-2 text-slate-400 font-medium">
                ⋯
              </span>
            ) : (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                  page === pageNum
                    ? "btn-primary text-white shadow-lg"
                    : "bg-slate-100 hover:bg-[var(--primary-100)] text-slate-600 hover:text-[var(--primary-600)]"
                )}
              >
                {pageNum}
              </Link>
            )
          )}
        </div>

        {/* Next */}
        {hasNextPage ? (
          <Link
            href={createPageUrl(page + 1)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-[var(--primary-100)] text-slate-600 hover:text-[var(--primary-600)] transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        ) : (
          <span className="p-2.5 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed">
            <ChevronRight className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
