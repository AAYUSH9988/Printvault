"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
    if (!isLoading && isAuthenticated && isLoginPage) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Login page - no sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protected pages - with sidebar
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Header */}
      <AdminHeader
        isSidebarCollapsed={isSidebarCollapsed}
        onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "pl-20" : "pl-72"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
