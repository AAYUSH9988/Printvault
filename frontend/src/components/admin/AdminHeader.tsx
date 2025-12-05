"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isSidebarCollapsed: boolean;
}

export function AdminHeader({ onMenuToggle, isSidebarCollapsed }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  // Get page title based on route
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname === "/admin/resources") return "Resources";
    if (pathname === "/admin/resources/new") return "Add New Resource";
    if (pathname.startsWith("/admin/resources/")) return "Edit Resource";
    return "Admin Panel";
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 z-40 transition-all duration-300",
        isSidebarCollapsed ? "left-20" : "left-72"
      )}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-64 pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* View Site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-colors border border-slate-700/50"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Site</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/50">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700/50"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                showUserMenu && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 py-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 z-20">
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-sm font-medium text-white">Admin Panel</p>
                    <p className="text-xs text-slate-500">Printvault by Jalaram Cards</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
