"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/resources?category=bhagwan", label: "Bhagwan" },
  { href: "/resources?category=frames", label: "Frames" },
  { href: "/resources?category=initials", label: "Initials" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-[var(--primary-100)] shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)] to-[var(--gold-500)] rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--gold-500)] shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold gradient-text font-display">
              Printvault
            </span>
            <span className="hidden sm:block text-xs text-[var(--primary-400)] font-medium">
              by Jalaram Cards
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--primary-600)] transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--gold-500)] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/resources"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            Browse All
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-[var(--primary-50)] hover:bg-[var(--primary-100)] text-[var(--primary-600)] transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 w-full glass border-t border-[var(--primary-100)] shadow-xl transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="container mx-auto px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-gray-700 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] rounded-xl transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[var(--primary-100)]">
            <Link
              href="/resources"
              onClick={() => setIsOpen(false)}
              className="btn-primary flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              Browse All Resources
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
