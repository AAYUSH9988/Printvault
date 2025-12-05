"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  FileStack,
  Download,
  Filter,
  X
} from "lucide-react";
import {
  getAdminResources,
  deleteResource,
  toggleFeatured,
} from "@/lib/admin-api";
import { formatCategoryLabel } from "@/lib/utils";
import type { Resource, PaginationMeta } from "@/types";

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  bhagwan: "🙏",
  frames: "🖼️",
  initials: "💑",
  templates: "📄",
  elements: "✨",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminResources({
        page,
        limit: 12,
        category: category || undefined,
        q: search || undefined,
      });
      setResources(res.data || []);
      setMeta(res.meta);
    } catch {
      console.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setActionLoading(id);
    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete resource");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleFeatured(id: string) {
    setActionLoading(id);
    try {
      const res = await toggleFeatured(id);
      if (res.success && res.data) {
        setResources((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, featured: res.data!.featured } : r
          )
        );
      }
    } catch {
      alert("Failed to toggle featured status");
    } finally {
      setActionLoading(null);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchResources();
  }

  const categories = [
    { value: "", label: "All Categories", emoji: "📁" },
    { value: "bhagwan", label: "Bhagwan / Deities", emoji: "🙏" },
    { value: "frames", label: "Frames & Borders", emoji: "🖼️" },
    { value: "initials", label: "Couple Initials", emoji: "💑" },
    { value: "templates", label: "Card Templates", emoji: "📄" },
    { value: "elements", label: "Design Elements", emoji: "✨" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <FileStack className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">All Resources</h1>
              <p className="text-sm text-slate-400">
                {meta?.total || 0} resources in your library
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, tags..."
                className="w-full pl-12 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid/Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <FileStack className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No resources found</h3>
            <p className="text-slate-500 mb-6">
              {search || category ? "Try adjusting your filters" : "Get started by adding your first resource"}
            </p>
            <Link
              href="/admin/resources/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl hover:bg-violet-500/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700/50">
              <div className="col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Resource
              </div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Formats
              </div>
              <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                Downloads
              </div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-700/50">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 transition-colors"
                >
                  {/* Resource Info */}
                  <div className="lg:col-span-5 flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {resource.previewUrl ? (
                        <img
                          src={resource.previewUrl}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{categoryEmojis[resource.category] || "📦"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">
                          {resource.title}
                        </p>
                        {resource.featured && (
                          <Star className="w-4 h-4 text-amber-400 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {resource.slug}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="lg:col-span-2 flex items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm rounded-lg">
                      <span>{categoryEmojis[resource.category] || "📦"}</span>
                      <span className="hidden sm:inline">{formatCategoryLabel(resource.category)}</span>
                    </span>
                  </div>

                  {/* Formats */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 flex-wrap">
                    {resource.formats.map((format) => (
                      <span
                        key={format}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg uppercase ${
                          format === "pdf"
                            ? "bg-rose-500/20 text-rose-400"
                            : format === "cdr"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {format}
                      </span>
                    ))}
                  </div>

                  {/* Downloads */}
                  <div className="lg:col-span-1 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <Download className="w-4 h-4" />
                      {resource.downloadCount || 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex items-center justify-end gap-2">
                    {/* Toggle Featured */}
                    <button
                      onClick={() => handleToggleFeatured(resource._id)}
                      disabled={actionLoading === resource._id}
                      className={`p-2.5 rounded-xl transition-colors ${
                        resource.featured
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-700/50 text-slate-500 hover:text-amber-400 hover:bg-amber-500/20"
                      }`}
                      title={resource.featured ? "Remove from featured" : "Add to featured"}
                    >
                      {resource.featured ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>

                    {/* View */}
                    <Link
                      href={`/resources/${resource.slug}`}
                      target="_blank"
                      className="p-2.5 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                      title="View on website"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/admin/resources/${resource._id}`}
                      className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
                      title="Edit resource"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(resource._id)}
                      disabled={actionLoading === resource._id}
                      className="p-2.5 rounded-xl bg-slate-700/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete resource"
                    >
                      {actionLoading === resource._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 rounded-xl border border-slate-700/50 px-4 py-3">
          <p className="text-slate-400 text-sm">
            Showing <span className="font-medium text-white">{((meta.page - 1) * 12) + 1}</span> to{" "}
            <span className="font-medium text-white">{Math.min(meta.page * 12, meta.total)}</span> of{" "}
            <span className="font-medium text-white">{meta.total}</span> resources
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!meta.hasPrevPage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                let pageNum;
                if (meta.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (meta.page <= 3) {
                  pageNum = i + 1;
                } else if (meta.page >= meta.totalPages - 2) {
                  pageNum = meta.totalPages - 4 + i;
                } else {
                  pageNum = meta.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      pageNum === meta.page
                        ? "bg-violet-500 text-white"
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNextPage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
