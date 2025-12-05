"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileStack,
  Star,
  Download,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Eye,
  BarChart3,
  Activity,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/lib/admin-api";
import { formatCategoryLabel } from "@/lib/utils";

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  bhagwan: "🙏",
  frames: "🖼️",
  initials: "💑",
  templates: "📄",
  elements: "✨",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Welcome skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-slate-800 rounded-xl w-64 mb-2" />
            <div className="h-5 bg-slate-800/60 rounded-lg w-48" />
          </div>
          <div className="h-12 bg-slate-800 rounded-xl w-40" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-800/50 rounded-2xl" />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-800/50 rounded-2xl" />
          <div className="h-80 bg-slate-800/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Welcome back! 👋
            </h1>
          </div>
          <p className="text-slate-400">
            Here&apos;s what&apos;s happening with your Printvault resources.
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Resources */}
        <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileStack className="w-6 h-6 text-blue-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                Active
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.totalResources || 0}
            </p>
            <p className="text-sm text-slate-400">Total Resources</p>
          </div>
        </div>

        {/* Featured */}
        <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.featuredCount || 0}
            </p>
            <p className="text-sm text-slate-400">Featured Items</p>
          </div>
        </div>

        {/* Downloads */}
        <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                Growing
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.totalDownloads?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-slate-400">Total Downloads</p>
          </div>
        </div>

        {/* Categories */}
        <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                Types
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.categoryStats?.length || 0}
            </p>
            <p className="text-sm text-slate-400">Categories</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Stats */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">By Category</h2>
                  <p className="text-sm text-slate-500">Resource distribution</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {stats?.categoryStats?.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No categories yet</p>
            ) : (
              stats?.categoryStats?.map((cat) => {
                const percentage = stats?.totalResources 
                  ? Math.round((cat.count / stats.totalResources) * 100) 
                  : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{categoryEmojis[cat.category] || "📦"}</span>
                        <span className="text-sm font-medium text-slate-300">
                          {formatCategoryLabel(cat.category)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">{percentage}%</span>
                        <span className="px-2.5 py-1 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg">
                          {cat.count}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Resources */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Recent Resources</h2>
                  <p className="text-sm text-slate-500">Latest additions</p>
                </div>
              </div>
              <Link
                href="/admin/resources"
                className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-700/50">
            {stats?.recentResources?.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No resources yet</p>
            ) : (
              stats?.recentResources?.map((resource) => (
                <Link
                  key={resource._id}
                  href={`/admin/resources/${resource._id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors group"
                >
                  {/* Preview Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                    {categoryEmojis[resource.category] || "📦"}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-violet-400 transition-colors">
                      {resource.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {formatCategoryLabel(resource.category)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <Eye className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/20 rounded-2xl border border-violet-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Quick Actions</h3>
            <p className="text-sm text-slate-400">Common tasks you can perform</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/resources/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-xl transition-colors border border-violet-500/30"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </Link>
            <Link
              href="/admin/resources"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-600/50"
            >
              <FileStack className="w-4 h-4" />
              Manage Resources
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-600/50"
            >
              <Eye className="w-4 h-4" />
              View Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
