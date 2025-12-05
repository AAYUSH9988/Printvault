"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  Plus,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Settings,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    label: "Resources",
    href: "/admin/resources",
    icon: FileStack,
    description: "Manage resources",
  },
  {
    label: "Add Resource",
    href: "/admin/resources/new",
    icon: Plus,
    description: "Create new",
  },
];

const bottomItems = [
  {
    label: "View Website",
    href: "/",
    icon: ExternalLink,
    external: true,
  },
  {
    label: "Help & Support",
    href: "#",
    icon: HelpCircle,
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-800/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-50" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-white text-lg leading-tight">Printvault</h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-r-full" />
              )}
              
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-slate-800/50 text-slate-500 group-hover:bg-slate-700 group-hover:text-white"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="block">{item.label}</span>
                  <span className="block text-xs text-slate-500 group-hover:text-slate-400">
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          );
        })}

        {/* Quick Stats - Only when expanded */}
        {!isCollapsed && (
          <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Resources</p>
                <p className="text-xs text-slate-500">Quick overview</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold text-white">--</span>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800/50 space-y-1.5">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Others
          </p>
        )}
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover:bg-slate-700 group-hover:text-white transition-all">
              <item.icon className="w-5 h-5" />
            </div>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
        
        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-all">
            <LogOut className="w-5 h-5" />
          </div>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
