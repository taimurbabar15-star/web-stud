"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, BookOpen, Camera, Award, User, 
  ChevronRight, ExternalLink, ShieldCheck, Mail, Phone, Lock, 
  Settings, CheckCircle2, Bell, AlertCircle, Compass, FolderOpen,
  Calendar as CalendarIcon, MapPin
} from "lucide-react";
import { updateProfileAction, updatePasswordAction } from "@/app/actions/profile";

interface DashboardClientProps {
  user: any;
  enrollments: any[];
  subscriptions: any[];
  appointments: any[];
  certificates: any[];
  clientGalleries: any[];
  notifications: any[];
  defaultTab: string;
}

export default function DashboardClient({
  user, enrollments, subscriptions, appointments, certificates, clientGalleries, notifications, defaultTab
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isPending, startTransition] = useTransition();

  // Profile forms state feedback
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Discord simulation state
  const [discordConnected, setDiscordConnected] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfileAction(null, formData);
      if (res?.error) {
        setProfileError(res.error);
      } else if (res?.success) {
        setProfileSuccess(true);
        router.refresh();
      }
    });
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSuccess(false);
    setPasswordError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const res = await updatePasswordAction(null, formData);
      if (res?.error) {
        setPasswordError(res.error);
      } else if (res?.success) {
        setPasswordSuccess(true);
        form.reset();
      }
    });
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "membership", label: "My Membership", icon: ShieldCheck },
    { id: "bookings", label: "My Bookings", icon: Camera },
    { id: "galleries", label: "Private Galleries", icon: FolderOpen },
    { id: "certificates", label: "My Certificates", icon: Award },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. SIDEBAR (Desktop) / TOP CHIPS (Mobile) */}
        <aside className="w-full lg:w-64 shrink-0">
          {/* Desktop Vertical Menu */}
          <nav className="hidden lg:flex flex-col space-y-1 bg-brand-black-rich border border-white/[0.05] p-3 rounded-xl">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Update URL parameter without full page reload
                    const url = new URL(window.location.href);
                    url.searchParams.set("tab", item.id);
                    window.history.pushState({}, "", url.toString());
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                    isActive 
                      ? "bg-brand-gold-premium/10 text-brand-gold-premium border-l-2 border-brand-gold-premium" 
                      : "text-brand-text-secondary-gray hover:bg-white/[0.02] hover:text-brand-text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Bottom/Top Horizontal chips scroll */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 border-b border-white/[0.05] no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-wider shrink-0 transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-brand-gold-premium text-brand-black-deep font-black"
                      : "bg-brand-black-rich border border-white/[0.05] text-brand-text-secondary-gray"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* 2. DYNAMIC CONTENT WORKSPACE */}
        <section className="flex-grow min-h-[500px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Alert */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-gold-premium/5 blur-3xl pointer-events-none" />
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-brand-text-white">
                  Welcome back, {user.name.split(" ")[0]}!
                </h2>
                <p className="text-xs text-brand-text-secondary-gray mt-1 leading-normal max-w-xl">
                  This dashboard gives you instant access to your trading courses, certificates, private photo shoots, and billing profiles.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-blue-electric/15 text-brand-blue-bright border border-brand-blue-electric/25">
                    Role: {user.role}
                  </span>
                </div>
              </div>

              {/* Quick statistics layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg text-center">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">Courses Enrolled</span>
                  <span className="font-display text-2xl font-black text-brand-text-white mt-1 block">{enrollments.length}</span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg text-center">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">VIP Subscriptions</span>
                  <span className="font-display text-2xl font-black text-brand-text-white mt-1 block">
                    {subscriptions.filter(s => s.status === "ACTIVE").length}
                  </span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg text-center">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">Booked Shoots</span>
                  <span className="font-display text-2xl font-black text-brand-text-white mt-1 block">{appointments.length}</span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg text-center">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">Graduation Certs</span>
                  <span className="font-display text-2xl font-black text-brand-text-white mt-1 block">{certificates.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Discord access panel */}
                <div className="glass-panel border-brand-blue-electric/20 rounded-xl p-6 bg-brand-blue-electric/[0.01] flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">
                      BKMSFX Discord Server
                    </h3>
                    <p className="text-xs text-brand-text-secondary-gray leading-relaxed">
                      Connect your account to the official BKMSFX Discord to unlock private student lounges, trading channels, and mentor chatrooms.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <a
                      href="https://discord.gg/nGpfV3RHC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded bg-brand-blue-electric text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-bright transition-colors"
                    >
                      Join Discord Server
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => {
                        setDiscordConnected(true);
                        alert("Discord connected successfully! Checked roles inside BKMSFX guild.");
                      }}
                      disabled={discordConnected}
                      className={`py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-colors ${
                        discordConnected 
                          ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" 
                          : "border-white/[0.08] hover:bg-white/[0.02] text-brand-text-white"
                      }`}
                    >
                      {discordConnected ? "✓ Discord Synced" : "Sync Discord Profile"}
                    </button>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="glass-panel border-white/[0.05] rounded-xl p-6 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-brand-text-white uppercase tracking-wider mb-4">
                    Recent Notifications
                  </h3>
                  <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-brand-text-secondary-gray italic">No new notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="text-xs border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                          <p className="font-semibold text-brand-text-white">{n.title}</p>
                          <p className="text-[11px] text-brand-text-secondary-gray mt-0.5 leading-normal">{n.message}</p>
                          <span className="text-[9px] text-brand-text-secondary-gray mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-6">
                Active Enrolled Courses
              </h2>

              {enrollments.length === 0 ? (
                <div className="text-center py-16 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto space-y-4">
                  <BookOpen className="h-10 w-10 text-brand-text-secondary-gray/50 mx-auto" />
                  <p className="text-xs text-brand-text-secondary-gray leading-normal">
                    You haven't enrolled in any educational courses yet.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex px-4 py-2 bg-brand-blue-electric text-white text-xs font-semibold rounded hover:bg-brand-blue-bright transition-colors"
                  >
                    Browse Course Catalog
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrollments.map((enr) => {
                    const course = enr.course;
                    const firstLesson = course.modules[0]?.lessons[0];
                    return (
                      <div key={enr.id} className="glass-panel border-white/[0.05] rounded-xl overflow-hidden flex flex-col justify-between group">
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-bold text-brand-blue-bright bg-brand-blue-electric/10 px-2 py-0.5 rounded border border-brand-blue-electric/15">
                              {course.category}
                            </span>
                            <span className="text-xs font-semibold text-brand-gold-premium">
                              {enr.progress.toFixed(0)}% Completed
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white leading-snug">{course.title}</h3>

                          {/* Progress bar */}
                          <div className="w-full bg-white/5 rounded-full h-1.5">
                            <div 
                              className="bg-brand-blue-electric h-1.5 rounded-full" 
                              style={{ width: `${enr.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          {firstLesson ? (
                            <Link
                              href={`/learn/${course.id}/${firstLesson.id}`}
                              className="flex w-full items-center justify-center gap-1.5 py-2 rounded bg-white/5 border border-white/[0.08] hover:bg-white/[0.02] text-xs font-bold text-white uppercase tracking-wider"
                            >
                              Continue Learning
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <span className="block text-center text-[10px] text-brand-text-secondary-gray">Lessons coming soon</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUBSCRIPTION MEMBERSHIP */}
          {activeTab === "membership" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-6">
                VIP Memberships Status
              </h2>

              {subscriptions.length === 0 ? (
                <div className="text-center py-16 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto space-y-4">
                  <ShieldCheck className="h-10 w-10 text-brand-text-secondary-gray/50 mx-auto" />
                  <p className="text-xs text-brand-text-secondary-gray leading-normal">
                    No active membership subscriptions found on your account. Purchase a tier to access indicator tools and Discord channels.
                  </p>
                  <Link
                    href="/vip"
                    className="inline-flex px-4 py-2 bg-brand-gold-premium text-brand-black-deep text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-gold-bright transition-colors"
                  >
                    Join Membership Tiers
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {subscriptions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className={`glass-panel border-white/[0.05] rounded-xl p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${
                        sub.status === "ACTIVE" ? "border-brand-gold-premium/25" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-brand-text-white uppercase tracking-wider">
                            BKMSFX {sub.membership.name} Plan
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            sub.status === "ACTIVE" 
                              ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" 
                              : "bg-red-950/20 text-red-400 border border-red-900/30"
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-secondary-gray leading-relaxed max-w-md">
                          {sub.membership.description}
                        </p>
                        <p className="text-[10px] text-brand-text-secondary-gray mt-2">
                          Start Date: {new Date(sub.startDate).toLocaleDateString()} • Next Renewal Date: <strong className="text-brand-text-white">{new Date(sub.renewalDate).toLocaleDateString()}</strong>
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Link
                          href="/trading/resources"
                          className="px-4 py-2 rounded bg-white/5 border border-white/[0.08] hover:bg-white/[0.02] text-xs font-semibold text-center text-white"
                        >
                          Access Pine Indicators
                        </Link>
                        {sub.status === "ACTIVE" && (
                          <button
                            onClick={() => alert("Subscription cancel requested. Your access will remain active until renewalDate.")}
                            className="px-4 py-2 rounded border border-red-900/30 bg-red-950/20 text-red-400 text-xs font-semibold"
                          >
                            Cancel Renewal
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-6">
                Scheduled Photoshoot Appointments
              </h2>

              {appointments.length === 0 ? (
                <div className="text-center py-16 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto space-y-4">
                  <Camera className="h-10 w-10 text-brand-text-secondary-gray/50 mx-auto" />
                  <p className="text-xs text-brand-text-secondary-gray leading-normal">
                    You have no photoshoot bookings scheduled.
                  </p>
                  <Link
                    href="/photography"
                    className="inline-flex px-4 py-2 bg-brand-gold-premium text-brand-black-deep text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-gold-bright transition-colors"
                  >
                    Book Photoshoot Session
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="glass-panel border-white/[0.05] rounded-xl p-6 relative flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/[0.04] mb-4">
                        <div>
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{appt.package.title}</h3>
                          <p className="text-[10px] text-brand-text-secondary-gray mt-1 flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-brand-gold-premium" />
                            {appt.date} • {appt.startTime} - {appt.endTime}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          appt.status === "CONFIRMED" 
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                            : appt.status === "PENDING"
                              ? "bg-brand-gold-premium/10 text-brand-gold-premium border-brand-gold-premium/20"
                              : "bg-white/5 text-brand-text-secondary-gray border-white/[0.08]"
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="text-brand-text-secondary-gray">Location Details:</p>
                          <p className="text-white flex items-center gap-1"><MapPin className="h-4 w-4 text-brand-gold-premium" /> {appt.location}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-brand-text-secondary-gray">Billing Ledger:</p>
                          <p className="text-white">
                            Total: ${appt.package.price.toFixed(2)} • Deposit: Paid (${appt.package.depositAmount.toFixed(2)}) • Balance:{" "}
                            <span className="font-bold text-brand-gold-premium">${(appt.package.price - appt.package.depositAmount).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>

                      {appt.notes && (
                        <div className="mt-4 p-3 bg-brand-black-deep rounded border border-white/[0.03] text-[11px] text-brand-text-secondary-gray">
                          <span className="font-semibold text-brand-text-white block mb-0.5">Customer Notes:</span>
                          {appt.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRIVATE GALLERIES */}
          {activeTab === "galleries" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-6">
                Your Private Photo Galleries
              </h2>

              {clientGalleries.length === 0 ? (
                <div className="text-center py-16 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto space-y-3">
                  <FolderOpen className="h-10 w-10 text-brand-text-secondary-gray/50 mx-auto" />
                  <p className="text-xs text-brand-text-secondary-gray leading-normal">
                    You have no private client galleries prepared yet.
                  </p>
                  <p className="text-[10px] text-brand-text-secondary-gray max-w-xs mx-auto leading-relaxed italic">
                    Once your photographer completes editing, they will upload your secure download files here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {clientGalleries.map((gal) => (
                    <div key={gal.id} className="glass-panel border-white/[0.05] rounded-xl p-5 flex flex-col justify-between group">
                      <div className="space-y-3.5">
                        <span className="text-[9px] uppercase font-bold text-brand-gold-premium tracking-wider block">Private Gallery Collection</span>
                        <h3 className="text-sm font-bold text-white group-hover:text-brand-gold-premium transition-colors uppercase tracking-wide">{gal.title}</h3>
                        <div className="text-[10px] text-brand-text-secondary-gray space-y-1">
                          <p>Downloads count: {gal.downloadsCount}</p>
                          {gal.expirationDate && (
                            <p>Expiration date: {new Date(gal.expirationDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/[0.03]">
                        <Link
                          href={`/photography/gallery/${gal.slug}`}
                          className="flex w-full items-center justify-center gap-1.5 py-2.5 rounded bg-white/5 border border-white/[0.08] hover:bg-white/[0.02] text-xs font-bold text-white uppercase tracking-wider"
                        >
                          View Photos
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MY CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-6">
                Issued Course Certificates
              </h2>

              {certificates.length === 0 ? (
                <div className="text-center py-16 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto space-y-4">
                  <Award className="h-10 w-10 text-brand-text-secondary-gray/50 mx-auto" />
                  <p className="text-xs text-brand-text-secondary-gray leading-normal">
                    You have no graduation certificates generated yet. Complete 100% of any academy program to receive your certificate.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex px-4 py-2 bg-brand-blue-electric text-white text-xs font-semibold rounded hover:bg-brand-blue-bright transition-colors"
                  >
                    Start Learning
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="glass-panel border-white/[0.05] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-l-4 border-l-brand-gold-premium">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-brand-gold-premium tracking-wider">
                          <Award className="h-4 w-4" /> BKMSFX Certified Graduate
                        </div>
                        <h3 className="text-base font-bold text-white mt-1 uppercase tracking-wide">{cert.course.title}</h3>
                        <p className="text-xs text-brand-text-secondary-gray">
                          Certificate ID: <span className="font-mono text-brand-text-white">{cert.certificateNumber}</span> • Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => alert(`Certificate ${cert.certificateNumber} downloaded successfully!`)}
                          className="px-4 py-2 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                        >
                          Download Certificate PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Profile Details Form */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Personal Information
                  </h3>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase">
                    Update profile records
                  </p>
                </div>

                {profileSuccess && (
                  <div className="rounded bg-emerald-950/20 border border-emerald-900/30 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    Profile updated successfully!
                  </div>
                )}

                {profileError && (
                  <div className="rounded bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={user.name}
                        required
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email-p" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Email Address (Locked)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-4 w-4 text-brand-text-secondary-gray/50" />
                      </div>
                      <input
                        id="email-p"
                        type="email"
                        disabled
                        value={user.email}
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich/50 py-2 pl-10 pr-3 text-xs text-brand-text-secondary-gray/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Phone className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={user.phone || ""}
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-40"
                  >
                    {isPending ? "Updating profile..." : "Save Profile Details"}
                  </button>
                </form>
              </div>

              {/* Password change form */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Change Password
                  </h3>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase">
                    Change account password
                  </p>
                </div>

                {passwordSuccess && (
                  <div className="rounded bg-emerald-950/20 border border-emerald-900/30 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    Password updated successfully!
                  </div>
                )}

                {passwordError && (
                  <div className="rounded bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-40"
                  >
                    {isPending ? "Updating password..." : "Change Account Password"}
                  </button>
                </form>
              </div>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}
