"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, X, Info, Trash2, FileText, ImageIcon, Sparkles, Tag, Eye } from "lucide-react";
import {
  getAdminResourceById,
  updateResource,
  deleteResource,
  CreateResourceData,
} from "@/lib/admin-api";
import type { ResourceCategory } from "@/types";

const categories: { value: ResourceCategory; label: string; emoji: string }[] = [
  { value: "bhagwan", label: "Bhagwan / Deities", emoji: "🙏" },
  { value: "frames", label: "Frames & Borders", emoji: "🖼️" },
  { value: "initials", label: "Couple Initials", emoji: "💑" },
  { value: "templates", label: "Card Templates", emoji: "📄" },
  { value: "elements", label: "Design Elements", emoji: "✨" },
];

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");

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

  useEffect(() => {
    async function fetchResource() {
      try {
        const res = await getAdminResourceById(id);
        if (res.success && res.data) {
          const r = res.data;
          setSlug(r.slug);
          setFormData({
            title: r.title,
            category: r.category,
            description: r.description,
            tags: r.tags || [],
            previewUrl: r.previewUrl || "",
            drivePdfId: r.drivePdfId || "",
            driveCdrId: r.driveCdrId || "",
            driveAiId: r.driveAiId || "",
            driveSvgId: r.driveSvgId || "",
            driveEpsId: r.driveEpsId || "",
            featured: r.featured || false,
          });
        } else {
          setError("Resource not found");
        }
      } catch {
        setError("Failed to load resource");
      } finally {
        setLoading(false);
      }
    }
    fetchResource();
  }, [id]);

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
    setSaving(true);

    try {
      const res = await updateResource(id, formData);
      if (res.success) {
        router.push("/admin/resources");
      } else {
        setError(res.error || "Failed to update resource");
      }
    } catch {
      setError("Failed to update resource");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;

    setDeleting(true);
    try {
      await deleteResource(id);
      router.push("/admin/resources");
    } catch {
      setError("Failed to delete resource");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading resource...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/resources"
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">Edit Resource</h1>
            <p className="text-slate-400 text-sm mt-0.5">Update resource details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <Link
              href={`/resources/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Link>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition-colors"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
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
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
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
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
