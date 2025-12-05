import Link from "next/link";
import { Sparkles, Heart, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  resources: [
    { href: "/resources?category=bhagwan", label: "Bhagwan / Deities" },
    { href: "/resources?category=frames", label: "Frames & Borders" },
    { href: "/resources?category=initials", label: "Couple Initials" },
    { href: "/resources?category=templates", label: "Card Templates" },
    { href: "/resources?category=elements", label: "Design Elements" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-[var(--primary-500)] via-[var(--gold-500)] to-[var(--primary-500)]" />
      
      {/* Main Footer */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pattern-overlay">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)] to-[var(--gold-500)] rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--gold-500)]">
                    <Sparkles className="h-6 w-6 text-black" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-black font-display">
                  Printvault
                </span>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-6">
                Free print resources library for wedding card designers. 
                Download premium Bhagwan artworks, frames, and templates.
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--gold-500)]/20 rounded-full border border-[var(--primary-500)]/30 w-fit">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">100% Free Forever</span>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--gold-500)]" />
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-[var(--gold-400)] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--gold-400)] transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--gold-500)]" />
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-[var(--gold-400)] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--gold-400)] transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--gold-500)]" />
                Get in Touch
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--primary-400)] mt-0.5 shrink-0" />
                  <span className="text-slate-400">
                    Raopura, Vadodara<br />Gujarat, India
                  </span>
                </li>
                <li>
                  <a href="tel:+919898989898" className="flex items-center gap-3 text-slate-400 hover:text-[var(--gold-400)] transition-colors">
                    <Phone className="h-5 w-5 text-[var(--primary-400)]" />
                    +91 98989 89898
                  </a>
                </li>
                <li>
                  <a href="mailto:info@jalaramcards.com" className="flex items-center gap-3 text-slate-400 hover:text-[var(--gold-400)] transition-colors">
                    <Mail className="h-5 w-5 text-[var(--primary-400)]" />
                    info@jalaramcards.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Printvault. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              Crafted with <Heart className="h-4 w-4 text-[var(--primary-500)] fill-[var(--primary-500)] animate-pulse" /> by{" "}
              <a
                href="https://jalaramcards.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold-400)] hover:text-[var(--gold-300)] transition-colors inline-flex items-center gap-1"
              >
                Jalaram Cards
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
