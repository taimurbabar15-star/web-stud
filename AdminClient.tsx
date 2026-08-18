"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, BookOpen, Camera, ShieldAlert, Plus, Search, 
  Trash, Download, Key, DollarSign, Calendar, TrendingUp, 
  Settings, CheckCircle, FileText, RefreshCw 
} from "lucide-react";
import { 
  adminUpdateUserRoleAction, adminUpdateAppointmentStatusAction, 
  adminCreateAvailabilitySlotAction, adminCreateCourseAction, 
  adminCreateFaqAction, adminDeleteFaqAction, adminCreateClientGalleryAction 
} from "@/app/actions/admin";

interface AdminClientProps {
  users: any[];
  payments: any[];
  courses: any[];
  appointments: any[];
  availability: any[];
  faqs: any[];
  auditLogs: any[];
}

export default function AdminClient({
  users, payments, courses, appointments, availability, faqs, auditLogs
}: AdminClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  // Search state
  const [searchUser, setSearchUser] = useState("");

  // Form states
  const [newCourse, setNewCourse] = useState({ title: "", slug: "", description: "", price: "", difficulty: "BEGINNER" });
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "10:00", endTime: "11:00" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "Trading" });
  const [newGallery, setNewGallery] = useState({ userId: "", title: "", slug: "", password: "", imagesJson: "" });

  const [feedback, setFeedback] = useState<{ error?: string; success?: string } | null>(null);

  // Financial statistics
  const totalRevenue = payments.filter(p => p.status === "SUCCEEDED").reduce((sum, p) => sum + p.amount, 0);
  const courseSales = payments.filter(p => p.status === "SUCCEEDED" && p.type === "COURSE_PURCHASE").reduce((sum, p) => sum + p.amount, 0);
  const membershipSales = payments.filter(p => p.status === "SUCCEEDED" && p.type === "MEMBERSHIP_SUB").reduce((sum, p) => sum + p.amount, 0);
  const bookingDeposits = payments.filter(p => p.status === "SUCCEEDED" && p.type === "PHOTOGRAPHY_DEPOSIT").reduce((sum, p) => sum + p.amount, 0);

  // Filtered users list
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Actions
  const handleRoleChange = (userId: string, newRole: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await adminUpdateUserRoleAction(userId, newRole);
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "User role updated successfully!" });
        router.refresh();
      }
    });
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await adminCreateCourseAction(
        newCourse.title, newCourse.slug, newCourse.description, 
        Number(newCourse.price), newCourse.difficulty
      );
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "Course created successfully!" });
        setNewCourse({ title: "", slug: "", description: "", price: "", difficulty: "BEGINNER" });
        router.refresh();
      }
    });
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await adminCreateAvailabilitySlotAction(newSlot.date, newSlot.startTime, newSlot.endTime);
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "Availability slot added successfully!" });
        setNewSlot({ date: "", startTime: "10:00", endTime: "11:00" });
        router.refresh();
      }
    });
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await adminCreateFaqAction(newFaq.question, newFaq.answer, newFaq.category);
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "FAQ created successfully!" });
        setNewFaq({ question: "", answer: "", category: "Trading" });
        router.refresh();
      }
    });
  };

  const handleDeleteFaq = (faqId: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await adminDeleteFaqAction(faqId);
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "FAQ deleted successfully!" });
        router.refresh();
      }
    });
  };

  const handleUpdateBookingStatus = (apptId: string, status: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await adminUpdateAppointmentStatusAction(apptId, status);
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "Photoshoot status updated successfully!" });
        router.refresh();
      }
    });
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await adminCreateClientGalleryAction(
        newGallery.userId, newGallery.title, newGallery.slug, 
        newGallery.imagesJson, newGallery.password
      );
      if (res?.error) setFeedback({ error: res.error });
      else {
        setFeedback({ success: "Private client gallery published successfully!" });
        setNewGallery({ userId: "", title: "", slug: "", password: "", imagesJson: "" });
        router.refresh();
      }
    });
  };

  // CSV Exporter Helpers
  const exportUsersToCSV = () => {
    const headers = ["User ID,Name,Email,Phone,Role,Created At\n"];
    const rows = users.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.phone || ""}","${u.role}","${new Date(u.createdAt).toISOString()}"`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `BKMSFX_users_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPaymentsToCSV = () => {
    const headers = ["Transaction ID,User,Email,Amount,Currency,Type,Status,Created At\n"];
    const rows = payments.map(p => 
      `"${p.transactionId}","${p.user.name}","${p.user.email}",${p.amount},"${p.currency}","${p.type}","${p.status}","${new Date(p.createdAt).toISOString()}"`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `BKMSFX_payments_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "users", label: "Users List", icon: Users },
    { id: "courses", label: "Academy Courses", icon: BookOpen },
    { id: "photography", label: "Photoshoots", icon: Calendar },
    { id: "galleries", label: "Private Uploads", icon: Key },
    { id: "faqs", label: "CMS FAQs", icon: FileText },
    { id: "audit", label: "Audit Logs", icon: ShieldAlert },
    { id: "exports", label: "Exporter", icon: Download },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-brand-text-primary-gray">
      
      {/* Feedback Banner */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-lg text-xs border ${
          feedback.success 
            ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" 
            : "bg-red-950/20 border-red-900/30 text-red-400"
        }`}>
          {feedback.success || feedback.error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Tabs (Sidebar) */}
        <aside className="w-full lg:w-60 shrink-0">
          <nav className="flex lg:flex-col flex-wrap gap-1 bg-brand-black-rich border border-white/[0.05] p-3 rounded-xl">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setFeedback(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 ${
                    isActive 
                      ? "bg-brand-blue-electric/15 text-brand-blue-bright border-l-2 border-brand-blue-electric" 
                      : "text-brand-text-secondary-gray hover:bg-white/[0.02] hover:text-brand-text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content panel */}
        <section className="flex-grow min-h-[500px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="glass-panel border-white/[0.05] rounded-xl p-6">
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white">
                  Enterprise Administration Overview
                </h2>
                <p className="text-xs text-brand-text-secondary-gray mt-1 uppercase">
                  Sum total operational ledgers and metrics
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">Total Revenue</span>
                  <span className="font-display text-2xl font-black text-brand-gold-premium mt-1 block">${totalRevenue.toFixed(2)}</span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">LMS course sales</span>
                  <span className="font-display text-xl font-black text-brand-text-white mt-1 block">${courseSales.toFixed(2)}</span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">VIP Tiers Recs</span>
                  <span className="font-display text-xl font-black text-brand-text-white mt-1 block">${membershipSales.toFixed(2)}</span>
                </div>
                <div className="glass-panel border-white/[0.04] p-5 rounded-lg">
                  <span className="text-brand-text-secondary-gray text-[9px] uppercase font-bold tracking-widest block">Photo Deposits</span>
                  <span className="font-display text-xl font-black text-brand-text-white mt-1 block">${bookingDeposits.toFixed(2)}</span>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="glass-panel border-white/[0.04] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Recent Ledger Transactions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-brand-text-secondary-gray uppercase font-semibold text-[10px]">
                        <th className="pb-3">Transaction</th>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {payments.slice(0, 5).map((pay) => (
                        <tr key={pay.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3 font-mono">{pay.transactionId}</td>
                          <td className="py-3">{pay.user.name}</td>
                          <td className="py-3 uppercase text-[10px]">{pay.type}</td>
                          <td className="py-3 font-bold text-brand-gold-premium">${pay.amount.toFixed(2)}</td>
                          <td className="py-3"><span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">{pay.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-display text-xl font-black uppercase text-brand-text-white">
                  User Accounts list
                </h2>
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-brand-text-secondary-gray" />
                  </div>
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 pl-9 pr-3 text-xs text-brand-text-white focus:outline-none focus:border-brand-blue-electric"
                    placeholder="Search name, email, role..."
                  />
                </div>
              </div>

              <div className="glass-panel border-white/[0.04] rounded-xl overflow-hidden p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-brand-text-secondary-gray uppercase font-semibold text-[10px]">
                        <th className="pb-3">User Profile</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Role Tier</th>
                        <th className="pb-3">Action Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3.5">
                            <p className="font-bold text-white leading-none">{u.name}</p>
                            <p className="text-[10px] text-brand-text-secondary-gray mt-1">{u.email}</p>
                          </td>
                          <td className="py-3.5">{u.phone || "No phone"}</td>
                          <td className="py-3.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/[0.08]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={isPending}
                              className="bg-brand-black-rich border border-white/[0.08] text-[10px] px-2 py-1 rounded text-white focus:outline-none focus:border-brand-blue-electric"
                            >
                              <option value="USER">USER</option>
                              <option value="STUDENT">STUDENT (Pro)</option>
                              <option value="VIP">VIP</option>
                              <option value="PHOTOGRAPHER">PHOTOGRAPHER</option>
                              <option value="INSTRUCTOR">INSTRUCTOR</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE CATALOG BUILDER */}
          {activeTab === "courses" && (
            <div className="space-y-8">
              {/* Form Create Course */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Add New Academy Course
                </h3>
                <form onSubmit={handleCreateCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Course Title</label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. Master Class Forex Trading"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Course Slug</label>
                    <input
                      type="text"
                      required
                      value={newCourse.slug}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, slug: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. master-class-forex"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Description Summary</label>
                    <textarea
                      required
                      value={newCourse.description}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="Summary descriptions..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Price (USD, 0 for Free)</label>
                    <input
                      type="number"
                      required
                      value={newCourse.price}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. 299"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Difficulty Level</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-6 py-2.5 rounded bg-brand-blue-electric text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-bright"
                    >
                      {isPending ? "Creating..." : "Publish Course Catalog"}
                    </button>
                  </div>
                </form>
              </div>

              {/* List of active courses */}
              <div className="glass-panel border-white/[0.04] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Active Courses Catalog
                </h3>
                <div className="space-y-4">
                  {courses.map(c => (
                    <div key={c.id} className="p-4 rounded-lg bg-brand-black-deep border border-white/[0.03] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{c.title}</p>
                        <p className="text-[10px] text-brand-text-secondary-gray mt-0.5">Price: ${c.price} • Students: {c.studentCount}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 uppercase tracking-wider">{c.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOGRAPHY SCHEDULER */}
          {activeTab === "photography" && (
            <div className="space-y-8">
              {/* Form Add Availability Slot */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Add Availability Schedule Slot
                </h3>
                <form onSubmit={handleCreateSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      required
                      value={newSlot.date}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Start Time (24h)</label>
                    <input
                      type="text"
                      required
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. 10:00"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-2.5 rounded bg-brand-gold-premium text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-bright"
                    >
                      {isPending ? "Adding..." : "Add Slot"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Booked Appointments */}
              <div className="glass-panel border-white/[0.04] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Scheduled Photo Bookings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-brand-text-secondary-gray uppercase font-semibold text-[10px]">
                        <th className="pb-3">Date/Time</th>
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Package</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-white/[0.01]">
                          <td className="py-3">
                            <p className="font-bold text-white leading-none">{appt.date}</p>
                            <p className="text-[10px] text-brand-text-secondary-gray mt-1">{appt.startTime} - {appt.endTime}</p>
                          </td>
                          <td className="py-3">{appt.user.name}</td>
                          <td className="py-3">{appt.package.title}</td>
                          <td className="py-3">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${
                              appt.status === "CONFIRMED" 
                                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                                : appt.status === "CANCELLED"
                                  ? "bg-red-950/20 text-red-400 border-red-900/30"
                                  : "bg-white/5 text-brand-text-secondary-gray border-white/[0.08]"
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={appt.status}
                              onChange={(e) => handleUpdateBookingStatus(appt.id, e.target.value)}
                              disabled={isPending}
                              className="bg-brand-black-rich border border-white/[0.08] text-[9px] px-1.5 py-0.5 rounded text-white"
                            >
                              <option value="CONFIRMED">Confirm</option>
                              <option value="COMPLETED">Complete</option>
                              <option value="CANCELLED">Cancel</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRIVATE GALLERIES UPLOADER */}
          {activeTab === "galleries" && (
            <div className="space-y-6">
              <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Upload Private Client Gallery
                  </h3>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase">
                    Assign retouched photos to a customer
                  </p>
                </div>

                <form onSubmit={handleCreateGallery} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Assign User *</label>
                    <select
                      required
                      value={newGallery.userId}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, userId: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    >
                      <option value="">Select User Profile...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Gallery Title *</label>
                    <input
                      type="text"
                      required
                      value={newGallery.title}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, title: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. John Doe Portrait Session"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Secure Slug *</label>
                    <input
                      type="text"
                      required
                      value={newGallery.slug}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, slug: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="e.g. john-doe-portraits"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Security Password Key (Optional)</label>
                    <input
                      type="text"
                      value={newGallery.password}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder="Set access password"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Images JSON Array (Simulated URLs)</label>
                    <textarea
                      value={newGallery.imagesJson}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, imagesJson: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                      placeholder='e.g. ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800"]'
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg disabled:opacity-40"
                  >
                    {isPending ? "Publishing..." : "Create & Send Gallery Notification"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ CMS */}
          {activeTab === "faqs" && (
            <div className="space-y-8">
              {/* Form Create FAQ */}
              <div className="glass-panel border-white/[0.05] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Add New FAQ
                </h3>
                <form onSubmit={handleCreateFaq} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">FAQ Category</label>
                    <select
                      value={newFaq.category}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    >
                      <option value="Trading">Trading</option>
                      <option value="Courses">Courses</option>
                      <option value="VIP">VIP</option>
                      <option value="Payments">Payments</option>
                      <option value="Photography">Photography</option>
                      <option value="Appointments">Appointments</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Question Text</label>
                    <input
                      type="text"
                      required
                      value={newFaq.question}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-brand-text-secondary-gray mb-1.5">Answer Text</label>
                    <textarea
                      required
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                      className="block w-full rounded bg-brand-black-rich border border-white/[0.08] py-2 px-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded bg-brand-blue-electric text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-bright"
                  >
                    {isPending ? "Adding..." : "Add FAQ Entry"}
                  </button>
                </form>
              </div>

              {/* List of FAQs with Delete */}
              <div className="glass-panel border-white/[0.04] rounded-xl p-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Active FAQs
                </h3>
                <div className="space-y-3">
                  {faqs.map(faq => (
                    <div key={faq.id} className="p-4 rounded bg-brand-black-deep border border-white/[0.03] flex justify-between items-center text-xs gap-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-brand-gold-premium tracking-wider">{faq.category}</span>
                        <p className="font-bold text-white mt-1">{faq.question}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        disabled={isPending}
                        className="p-2 bg-red-950/20 text-red-400 rounded hover:bg-red-950/40 border border-red-900/30"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="glass-panel border-white/[0.05] rounded-xl p-6">
              <h2 className="font-display text-xl font-black uppercase text-brand-text-white mb-4">
                Platform Security Audit Logs
              </h2>
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="text-xs border-b border-white/[0.03] pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white uppercase tracking-wide text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-[9px] text-brand-text-secondary-gray">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-text-secondary-gray mt-1 leading-normal">
                      User: {log.user.name} ({log.user.email}) • Entity: {log.entity} ({log.entityId || "N/A"})
                    </p>
                    {log.metadata && (
                      <pre className="mt-1 p-2 rounded bg-black/40 text-[9px] font-mono text-brand-text-secondary-gray truncate">
                        {log.metadata}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CSV DATA EXPORTS */}
          {activeTab === "exports" && (
            <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Admin Reports Export Center
                </h3>
                <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase">
                  Export platform datasets directly to spreadsheet files
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                <div className="p-5 rounded-lg bg-brand-black-deep border border-white/[0.04] space-y-3 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-1.5"><Users className="h-4.5 w-4.5 text-brand-gold-premium" /> User Accounts Dataset</h4>
                  <p className="text-brand-text-secondary-gray leading-normal">
                    Download complete user directory including ID keys, names, contact numbers, and security roles.
                  </p>
                  <button
                    onClick={exportUsersToCSV}
                    className="flex w-full items-center justify-center gap-1.5 py-2 rounded bg-white/5 border border-white/[0.08] hover:bg-white/[0.02] font-semibold text-white transition-all uppercase tracking-wider text-[10px]"
                  >
                    <Download className="h-4 w-4" />
                    Export Users to CSV
                  </button>
                </div>

                <div className="p-5 rounded-lg bg-brand-black-deep border border-white/[0.04] space-y-3 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-1.5"><DollarSign className="h-4.5 w-4.5 text-brand-blue-bright" /> Financial Payments Ledger</h4>
                  <p className="text-brand-text-secondary-gray leading-normal">
                    Download full transaction logs ledger detailing amounts, currency, transaction ID tokens, and checkout types.
                  </p>
                  <button
                    onClick={exportPaymentsToCSV}
                    className="flex w-full items-center justify-center gap-1.5 py-2 rounded bg-white/5 border border-white/[0.08] hover:bg-white/[0.02] font-semibold text-white transition-all uppercase tracking-wider text-[10px]"
                  >
                    <Download className="h-4 w-4" />
                    Export Ledger to CSV
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
