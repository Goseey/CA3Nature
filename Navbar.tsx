"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "Events",      href: "/events" },
  { label: "Timetable",   href: "/timetable" },
  { label: "Map",         href: "/map" },
  { label: "Lost & Found",href: "/lost-found" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-slate-800 text-base tracking-tight">
            Campus<span className="text-blue-500">Companion</span>
          </span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  );
}
