"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const navigate = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Announcements", path: "/announcements" },
    { name: "Events", path: "/events" },
    { name: "Alerts", path: "/alerts" },
  ];

  if (user?.role === "super_admin") {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  } else if (
    user?.role === "faculty" ||
    user?.role === "hod" ||
    user?.role === "dean" ||
    user?.role === "principal"
  ) {
    navLinks.push({ name: "Profile", path: "/profile" });
  } else {
    navLinks.push({ name: "Contact", path: "/contact" });
  }

  const handleLogout = () => {
    logout();
    navigate.push("/");
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center w-full animate-fade-in font-display">
      <nav className="glass-nav bg-black rounded-md w-full max-w-5xl px-4 py-3 sm:px-6 flex items-center justify-between border-white/20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            <Bell className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-Bold tracking-tight">
            <span className="text-white">Notify</span>
            <span className="text-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center space-x-1"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navLinks.map((link) => {
            const isActualActive = isActive(link.path);
            const showPill =
              hoveredPath === link.path ||
              (hoveredPath === null && isActualActive);

            return (
              <Link
                key={link.path}
                href={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors z-10 ${
                  isActualActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {showPill && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-white/10 rounded-md -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth / Action */}
        <div className="hidden md:flex items-center">
          <a
            className="h-8 w-8 mr-4 justify-center items-center hover:-translate-y-1"
            href="/alerts"
          >
            <img src="/logos/alert.png" alt="alerts" />
          </a>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 group cursor-default"
                title={user?.name}
              >
                <img
                  src="/logos/profileLogo.png"
                  alt="Profile"
                  className="w-7 h-7 rounded-md invert brightness-75 group-hover:brightness-100 transition-all cursor-pointer"
                />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:border-gray-400 hover:bg-white/5 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <a
            className="h-9 w-9 mr-2 justify-center items-center"
            href="/alerts"
          >
            <img src="/logos/alert.png" alt="alerts" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 glass-nav rounded-2xl overflow-hidden md:hidden animate-slide-up flex flex-col p-2 bg-black backdrop-blur-md">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 pb-2">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 rounded-xl text-base font-medium text-white bg-white/10 hover:bg-white/20 text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
