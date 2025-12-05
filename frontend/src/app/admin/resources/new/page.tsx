"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, X, Info, FileText, ImageIcon, Sparkles, Tag } from "lucide-react";
import { createResource, CreateResourceData } from "@/lib/admin-api";
import type { ResourceCategory } from "@/types";

const categories: { value: ResourceCategory; label: string; emoji: string }[] = [
  { value: "bhagwan", label: "Bhagwan / Deities", emoji: "🙏" },
  { value: "frames", label: "Frames & Borders", emoji: "🖼️" },
  { value: "initials", label: "Couple Initials", emoji: "💑" },
  { value: "templates", label: "Card Templates", emoji: "📄" },
  { value: "elements", label: "Design Elements", emoji: "✨" },
];

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateResourceData>({
    title: "",
    category: "bhagwan",
    description: "",
    tags: [],
    previewUrl: "",
    drivePdfId: "",
    driveCdrId: "",
    driveAiId: "",
    driveSvgId: "",
    driveEpsId: "",
    featured: false,
  });

  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput("");
    }
  }

  function removeTag(tagToRemove: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createResource(formData);
      if (res.success) {
        router.push("/admin/resources");
      } else {
        setError(res.error || "Failed to create resource");
      }
    } catch {
      setError("Failed to create resource");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/resources"
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Add New Resource</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Create a new print resource for the library
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4" />
            </div>
            <p>{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Basic Information</h2>
              <p className="text-xs text-slate-500">Title, category and description</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Lord Ganesha Traditional Art"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as ResourceCategory,
                    }))
                  }
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Beautiful traditional design perfect for wedding cards..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent resize-none transition-all"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1.5" />
                Tags
              </label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-lg text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-violet-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag (press Enter)..."
                  className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-5 h-5 bg-slate-700 border-slate-600 rounded text-amber-500 focus:ring-amber-500"
              />
              <div>
                <label htmlFor="featured" className="text-white font-medium cursor-pointer flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Mark as Featured
                </label>
                <p className="text-xs text-slate-500">Featured resources appear on the homepage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">File Links</h2>
                <p className="text-xs text-slate-500">Google Drive file IDs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
              <Info className="w-3.5 h-3.5" />
              Enter Google Drive file IDs
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Preview Image URL
              </label>
              <input
                type="url"
                value={formData.previewUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, previewUrl: e.target.value }))
                }
                placeholder="https://drive.google.com/thumbnail?id=FILE_ID&sz=w400"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">
                Use Google Drive thumbnail URL format: https://drive.google.com/thumbnail?id=FILE_ID&sz=w400
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs uppercase mr-2">PDF</span>
                  File ID
                </label>
                <input
                  type="text"
                  value={formData.drivePdfId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, drivePdfId: e.target.value }))
                  }
                  placeholder="1abc123DEF456..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs uppercase mr-2">CDR</span>
                  File ID
                </label>
                <input
                  type="text"
                  value={formData.driveCdrId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, driveCdrId: e.target.value }))
                  }
                  placeholder="1abc123DEF456..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs uppercase mr-2">AI</span>
                  File ID
                </label>
                <input
                  type="text"
                  value={formData.driveAiId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, driveAiId: e.target.value }))
                  }
                  placeholder="1abc123DEF456..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs uppercase mr-2">SVG</span>
                  File ID
                </label>
                <input
                  type="text"
                  value={formData.driveSvgId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, driveSvgId: e.target.value }))
                  }
                  placeholder="1abc123DEF456..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs uppercase mr-2">EPS</span>
                  File ID
                </label>
                <input
                  type="text"
                  value={formData.driveEpsId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, driveEpsId: e.target.value }))
                  }
                  placeholder="1abc123DEF456..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/resources"
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Resource
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
