import { Suspense } from "react";
import { Metadata } from "next";
import { getResources, getCategories } from "@/lib/api";
import { ResourceGrid, ResourceFilter, Pagination } from "@/components/resources";
import type { ResourceCategory } from "@/types";
import { Sparkles, FolderOpen } from "lucide-react";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Free Print Resources - Printvault",
  description:
    "Browse and download free print resources including Bhagwan artworks, decorative frames, couple initials, and wedding card templates in PDF and CDR formats.",
};

interface ResourcesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
    sort?: string;
    featured?: string;
  }>;
}

async function ResourcesContent({
  searchParams,
}: {
  searchParams: ResourcesPageProps["searchParams"];
}) {
  const params = await searchParams;
  
  const page = parseInt(params.page || "1", 10);
  const limit = 12;

  // Build query params
  const queryParams = {
    page,
    limit,
    category: params.category as ResourceCategory | undefined,
    q: params.q,
    sort: params.sort as "newest" | "oldest" | "popular" | "title" | undefined,
    featured: params.featured === "true" ? true : undefined,
  };

  // Fetch data
  const [resourcesRes, categoriesRes] = await Promise.all([
    getResources(queryParams),
    getCategories(),
  ]);

  const resources = resourcesRes.data || [];
  const meta = resourcesRes.meta;
  const categories = categoriesRes.success ? categoriesRes.data || [] : [];

  // Find category label for title
  const getCategoryLabel = (cat: string) => {
    const found = categories.find((c) => c.name === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--gold-50)] pattern-overlay border-b border-slate-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur rounded-full border border-[var(--primary-200)] shadow-sm mb-4">
              <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
              <span className="text-sm font-semibold text-[var(--primary-600)]">
                {meta?.total || 0} Resources Available
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-display">
              {params.featured === "true" ? (
                <>
                  <span className="gradient-text">Featured</span> Resources
                </>
              ) : params.category ? (
                <>
                  <span className="gradient-text">{getCategoryLabel(params.category)}</span> Resources
                </>
              ) : (
                <>
                  All <span className="gradient-text">Resources</span>
                </>
              )}
            </h1>
            <p className="text-lg text-slate-600">
              {params.q
                ? `Search results for "${params.q}"`
                : "Discover premium print resources for your wedding card designs"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <ResourceFilter categories={categories} />

        {/* Results */}
        {resources.length > 0 ? (
          <>
            <div className="mt-10">
              <ResourceGrid resources={resources} />
            </div>
            {meta && meta.totalPages > 1 && (
              <div className="mt-12">
                <Pagination meta={meta} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
              <FolderOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 font-display">
              No resources found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any resources matching your criteria. 
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--gold-50)] border-b border-slate-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded-full w-48 mb-4" />
            <div className="h-12 bg-slate-200 rounded-2xl w-80 mb-4" />
            <div className="h-6 bg-slate-200 rounded-xl w-64" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          {/* Filter skeleton */}
          <div className="flex gap-4 mb-10">
            <div className="h-12 bg-slate-200 rounded-2xl flex-1 max-w-md" />
            <div className="h-12 bg-slate-200 rounded-2xl w-40" />
          </div>
          <div className="flex gap-2 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded-full w-28" />
            ))}
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-200 rounded-3xl h-96" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage(props: ResourcesPageProps) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSkeleton />}>
          <ResourcesContent searchParams={props.searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
