import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Header, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
              been moved or deleted.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                <Search className="h-5 w-5" />
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
