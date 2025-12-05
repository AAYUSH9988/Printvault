import Link from "next/link";
import { ArrowRight, Download, Sparkles, Users, Zap, Crown, Palette, Gift, Star, CheckCircle } from "lucide-react";
import { getFeaturedResources, getCategories } from "@/lib/api";
import { ResourceGrid } from "@/components/resources";
import { Header, Footer } from "@/components/layout";

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  bhagwan: "🙏",
  frames: "🖼️",
  initials: "💑",
  templates: "📄",
  elements: "✨",
};

export default async function HomePage() {
  const [featuredRes, categoriesRes] = await Promise.all([
    getFeaturedResources(6).catch(() => ({ success: false, data: [] })),
    getCategories().catch(() => ({ success: false, data: [] })),
  ]);

  const featured = featuredRes.success ? featuredRes.data || [] : [];
  const categories = categoriesRes.success ? categoriesRes.data || [] : [];

  return (
    <>
      <Header />
      <main className="flex-1">
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center animated-gradient mandala-pattern">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary-300)]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--gold-300)]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-300)]/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full border border-[var(--primary-200)] shadow-lg mb-8">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-[var(--primary-700)]">
                100% Free • No Login Required
              </span>
              <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display leading-tight">
              <span className="text-slate-800">Premium Print</span>
              <br />
              <span className="gradient-text">Resources Library</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Download stunning <span className="font-semibold text-[var(--primary-600)]">Bhagwan artworks</span>, 
              decorative <span className="font-semibold text-[var(--gold-600)]">frames</span>, 
              and <span className="font-semibold text-[var(--accent-600)]">couple initials</span> in 
              PDF & CDR formats. Perfect for wedding card designers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/resources"
                className="btn-primary group inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-full"
              >
                <Download className="h-5 w-5" />
                Start Downloading
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/resources?category=bhagwan"
                className="inline-flex items-center gap-3 px-8 py-4 glass border border-slate-200 hover:border-[var(--primary-300)] text-slate-700 font-semibold rounded-full transition-all hover:shadow-lg"
              >
                <span className="text-2xl">🙏</span>
                Bhagwan Collection
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Commercial Use Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>High Resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--primary-400)] flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-[var(--primary-400)] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Resources", icon: Palette },
              { value: "5", label: "Categories", icon: Crown },
              { value: "PDF & CDR", label: "Formats", icon: Download },
              { value: "Free", label: "Forever", icon: Gift },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--gold-50)] mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-7 w-7 text-[var(--primary-600)]" />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white pattern-overlay">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary-100)] text-[var(--primary-600)] text-sm font-semibold rounded-full mb-4">
              Categories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-display">
              Browse by Category
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Find exactly what you need for your next wedding card masterpiece
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/resources?category=${cat.name}`}
                className="group relative p-6 bg-white rounded-3xl border border-slate-200 hover:border-[var(--primary-300)] shadow-sm hover:shadow-xl transition-all duration-300 card-hover text-center overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)] to-[var(--gold-500)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {categoryIcons[cat.name] || "📦"}
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-white mb-1 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-slate-500 group-hover:text-white/80 transition-colors">
                    {cat.count} resources
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-4">
              <div>
                <span className="inline-block px-4 py-1.5 bg-[var(--gold-100)] text-[var(--gold-700)] text-sm font-semibold rounded-full mb-4">
                  <Star className="inline h-4 w-4 mr-1" />
                  Featured
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 font-display">
                  Featured Resources
                </h2>
                <p className="text-slate-600 text-lg">
                  Hand-picked premium designs for your projects
                </p>
              </div>
              <Link
                href="/resources?featured=true"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--primary-200)] hover:border-[var(--primary-400)] text-[var(--primary-600)] font-semibold rounded-full transition-colors"
              >
                View all featured
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ResourceGrid resources={featured} />
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-[var(--primary-600)] font-semibold"
              >
                View all resources <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--gold-50)] mandala-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[var(--accent-100)] text-[var(--accent-700)] text-sm font-semibold rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-display">
              Why Printvault?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Download",
                description: "No sign-up needed. Click download and get your files instantly in PDF or CDR format.",
                color: "from-[var(--primary-500)] to-[var(--primary-600)]",
                bgColor: "from-[var(--primary-50)] to-[var(--primary-100)]",
              },
              {
                icon: Crown,
                title: "Premium Quality",
                description: "High-resolution vector files optimized for professional printing. Perfect for wedding cards.",
                color: "from-[var(--gold-500)] to-[var(--gold-600)]",
                bgColor: "from-[var(--gold-50)] to-[var(--gold-100)]",
              },
              {
                icon: Users,
                title: "Commercial Use",
                description: "All resources are free for both personal and commercial wedding card printing projects.",
                color: "from-[var(--accent-500)] to-[var(--accent-600)]",
                bgColor: "from-[var(--accent-50)] to-[var(--accent-100)]",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 card-hover overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[var(--primary-900)] to-slate-900" />
        <div className="absolute inset-0 mandala-pattern opacity-10" />
        
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-500)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--gold-500)]/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-[var(--gold-400)]" />
              <span className="text-sm font-medium text-white/80">Start Creating Today</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">
              Ready to Create<br />
              <span className="gradient-text-gold">Beautiful Cards?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Browse our collection of premium print resources and download 
              the perfect designs for your next wedding card project.
            </p>
            <Link
              href="/resources"
              className="btn-gold inline-flex items-center gap-3 px-10 py-5 text-slate-900 font-bold rounded-full text-lg"
            >
              <Download className="h-6 w-6" />
              Start Downloading Free
            </Link>
          </div>
        </div>
      </section>
    </div>
      </main>
      <Footer />
    </>
  );
}
