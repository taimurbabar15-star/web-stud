"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, X, Bell, User, LogOut, BookOpen, Camera, 
  Sparkles, ChevronDown, Check, LayoutDashboard 
} from "lucide-react";
import { SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

interface NavbarClientProps {
  user: SessionUser | null;
  initialNotifications: any[];
}

export default function NavbarClient({ user, initialNotifications }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [hasUnread, setHasUnread] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasUnread(notifications.some(n => !n.readAt));
  }, [notifications]);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutAction();
    setUserDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const markAllAsRead = async () => {
    // Optimistic UI change
    setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
    setHasUnread(false);
    
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Trading", href: "/trading" },
    { name: "Photography", href: "/photography" },
    { name: "Courses", href: "/courses" },
    { name: "VIP", href: "/vip" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-brand-black-deep/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-display text-2xl font-black tracking-wider text-brand-text-white transition-all duration-300">
              BKMS<span className="text-brand-blue-electric group-hover:text-brand-gold-bright transition-colors">FX</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Link Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md hover:text-brand-text-white ${
                  isActive 
                    ? "text-brand-gold-premium font-semibold" 
                    : "text-brand-text-secondary-gray"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-gold-premium" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Right) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* Notification dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  id="navbar-notif-btn"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-full border border-white/[0.05] bg-brand-black-rich text-brand-text-primary-gray hover:text-brand-text-white transition-colors focus:outline-none"
                >
                  <Bell className="h-5 w-5" />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-blue-electric animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-lg glass-panel border border-white/[0.08] shadow-2xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-2 border-b border-white/[0.05] flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-text-white uppercase tracking-wider">Notifications</span>
                      {hasUnread && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-[10px] text-brand-blue-electric hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-brand-text-secondary-gray">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`px-4 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors ${
                              !notif.readAt ? "bg-brand-blue-electric/[0.02]" : ""
                            }`}
                          >
                            <p className="text-xs font-medium text-brand-text-white">{notif.title}</p>
                            <p className="text-[11px] text-brand-text-secondary-gray mt-1 leading-normal">{notif.message}</p>
                            <span className="text-[9px] text-brand-text-secondary-gray mt-2 block">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User profile dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  id="navbar-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 px-3 rounded-full border border-white/[0.05] bg-brand-black-rich text-brand-text-primary-gray hover:text-brand-text-white transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatar || "/images/avatars/default.jpg"}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover border border-white/[0.1]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                    }}
                  />
                  <span className="text-xs font-medium tracking-wide max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={`h-3 w-3 text-brand-text-secondary-gray transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-lg glass-panel border border-white/[0.08] shadow-2xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/[0.05]">
                      <p className="text-xs font-medium text-brand-text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-brand-text-secondary-gray truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-gold-premium/10 text-brand-gold-premium border border-brand-gold-premium/20">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-brand-text-primary-gray hover:text-brand-text-white hover:bg-white/[0.03] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-gold-premium" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 border-t border-white/[0.03] transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium tracking-wide text-brand-text-primary-gray hover:text-brand-text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold tracking-wide rounded-md bg-gold-gradient text-brand-black-deep hover:shadow-lg hover:shadow-brand-gold-premium/10 transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-2">
          {user && (
            <Link
              href="/dashboard"
              className="p-2 rounded-full border border-white/[0.05] bg-brand-black-rich text-brand-text-primary-gray"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-text-primary-gray hover:text-brand-text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-brand-black-rich py-4 px-4 space-y-1 z-45">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 rounded-md text-base font-medium tracking-wide transition-colors ${
                  isActive 
                    ? "bg-brand-gold-premium/10 text-brand-gold-premium border-l-2 border-brand-gold-premium" 
                    : "text-brand-text-secondary-gray hover:bg-white/[0.02] hover:text-brand-text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {!user ? (
            <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-2 px-4">
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-sm font-semibold tracking-wide rounded-md border border-white/[0.1] text-brand-text-white hover:bg-white/[0.02]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2.5 text-sm font-semibold tracking-wide rounded-md bg-gold-gradient text-brand-black-deep"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/[0.05] px-4 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar || "/images/avatars/default.jpg"}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover border border-white/[0.1]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                  }}
                />
                <div>
                  <p className="text-xs font-semibold text-brand-text-white">{user.name}</p>
                  <p className="text-[10px] text-brand-text-secondary-gray">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full text-center py-2.5 text-xs font-semibold tracking-wide rounded-md bg-brand-gold-premium/15 text-brand-gold-premium border border-brand-gold-premium/20"
              >
                User Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center py-2.5 text-xs font-semibold tracking-wide rounded-md bg-red-950/20 text-red-400 border border-red-900/30 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
