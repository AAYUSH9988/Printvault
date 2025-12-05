"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState, useCallback } from "react";
import type { CategoryWithCount, ResourceCategory } from "@/types";
import { cn } from "@/lib/utils";

interface ResourceFilterProps {
  categories: CategoryWithCount[];
  className?: string;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  bhagwan: "🙏",
  frames: "🖼️",
  initials: "💑",
  templates: "📄",
  elements: "✨",
};

export function ResourceFilter({ categories, className }: ResourceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const currentCategory = searchParams.get("category") as ResourceCategory | null;
  const currentSort = searchParams.get("sort") || "newest";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      // Reset to page 1 when filters change
      params.delete("page");
      
      router.push(`/resources?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search || null });
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/resources");
  };

  const hasFilters = currentCategory || search || currentSort !== "newest";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, tag, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); updateParams({ q: null }); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>
        </form>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="appearance-none pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-slate-700 font-medium shadow-sm cursor-pointer min-w-[180px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Alphabetical</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: null })}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
            !currentCategory
              ? "btn-primary text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-[var(--primary-300)] hover:text-[var(--primary-600)]"
          )}
        >
          <span className="mr-1.5">✨</span>
          All Resources
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => updateParams({ category: cat.name })}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2",
              currentCategory === cat.name
                ? "btn-primary text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:border-[var(--primary-300)] hover:text-[var(--primary-600)]"
            )}
          >
            <span>{categoryIcons[cat.name] || "📦"}</span>
            <span>{cat.label}</span>
            <span className={cn(
              "px-2 py-0.5 text-xs rounded-full",
              currentCategory === cat.name
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            )}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[var(--primary-50)] to-[var(--gold-50)] rounded-2xl border border-[var(--primary-100)]">
          <Sparkles className="h-4 w-4 text-[var(--primary-500)] shrink-0" />
          <span className="text-sm font-medium text-slate-600">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[var(--primary-700)] text-sm font-medium rounded-full border border-[var(--primary-200)]">
                {categoryIcons[currentCategory] || "📦"} {currentCategory}
                <button 
                  onClick={() => updateParams({ category: null })}
                  className="hover:bg-[var(--primary-100)] rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[var(--primary-700)] text-sm font-medium rounded-full border border-[var(--primary-200)]">
                🔍 &quot;{search}&quot;
                <button 
                  onClick={() => { setSearch(""); updateParams({ q: null }); }}
                  className="hover:bg-[var(--primary-100)] rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="ml-auto text-sm font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
