import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Download, Tag, Folder, Star, FileType, CheckCircle } from "lucide-react";
import { getResourceBySlug, getRelatedResources, getDownloadUrl } from "@/lib/api";
import { formatCategoryLabel, formatFormatLabel } from "@/lib/utils";
import { ResourceGrid } from "@/components/resources";
import { Header, Footer } from "@/components/layout";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getResourceBySlug(slug);

  if (!response.success || !response.data) {
    return {
      title: "Resource Not Found - Printvault",
    };
  }

  const resource = response.data;

  return {
    title: `${resource.title} - Free Download | Printvault`,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      images: resource.previewUrl ? [resource.previewUrl] : [],
    },
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  
  const [resourceRes, relatedRes] = await Promise.all([
    getResourceBySlug(slug),
    getRelatedResources(slug, 4),
  ]);

  if (!resourceRes.success || !resourceRes.data) {
    notFound();
  }

  const resource = resourceRes.data;
  const related = relatedRes.success ? relatedRes.data || [] : [];

  return (
    <>
      <Header />
      <main className="flex-1">
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary-600)] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Resources</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Preview Image - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              {/* Featured Badge */}
              {resource.featured && (
                <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-white text-sm font-semibold rounded-full shadow-lg">
                  <Star className="h-4 w-4 fill-current" />
                  Featured Resource
                </div>
              )}
              
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50">
                {resource.previewUrl ? (
                  <Image
                    src={resource.previewUrl}
                    alt={resource.title}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileType className="w-24 h-24 text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 font-display flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[var(--primary-500)] to-[var(--gold-500)] rounded-full" />
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          </div>

          {/* Sidebar - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                {/* Category */}
                <Link
                  href={`/resources?category=${resource.category}`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[var(--primary-50)] to-[var(--gold-50)] text-[var(--primary-600)] text-sm font-semibold rounded-full hover:from-[var(--primary-100)] hover:to-[var(--gold-100)] transition-colors mb-4"
                >
                  <Folder className="h-4 w-4" />
                  {formatCategoryLabel(resource.category)}
                </Link>

                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-800 mb-6 font-display leading-tight">
                  {resource.title}
                </h1>

                {/* Meta Info */}
                <div className="space-y-4 mb-8">
                  {resource.downloadCount !== undefined && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Download className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{resource.downloadCount.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">Downloads</div>
                      </div>
                    </div>
                  )}
                  {resource.createdAt && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {new Date(resource.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-slate-500">Added on</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Available Formats */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Available Formats
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.formats.map((format) => (
                      <span
                        key={format}
                        className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200"
                      >
                        {format.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Download Now
                  </h3>
                  {resource.formats.map((format, index) => (
                    <a
                      key={format}
                      href={getDownloadUrl(resource.slug, format)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl font-semibold transition-all ${
                        index === 0
                          ? "btn-primary text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Download className="h-5 w-5" />
                      Download {formatFormatLabel(format)}
                    </a>
                  ))}
                </div>

                {/* Free License Note */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800 text-sm">Free for Commercial Use</div>
                      <div className="text-xs text-green-600 mt-1">
                        Use this resource freely in your wedding card designs for personal or commercial projects.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/resources?q=${tag}`}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-12 h-1 bg-gradient-to-r from-[var(--primary-500)] to-[var(--gold-500)] rounded-full" />
              <h2 className="text-3xl font-bold text-slate-800 font-display">
                Related Resources
              </h2>
            </div>
            <ResourceGrid resources={related} />
          </div>
        )}
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
}
