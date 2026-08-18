"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, Clock, Send, HelpCircle, MapPin, Award, AlertCircle, CheckCircle } from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";

export default function ContactFormClient() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Field states and validation errors
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("Buyer Advisory");
  const [message, setMessage] = useState("");
  const [antispam, setAntispam] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    antispam?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    subject?: boolean;
    message?: boolean;
    antispam?: boolean;
  }>({});

  const validateField = (fieldName: string, value: string) => {
    let errorMsg = "";
    if (fieldName === "name") {
      if (!value.trim()) {
        errorMsg = "Full name is required.";
      } else if (value.trim().length < 2) {
        errorMsg = "Name must be at least 2 characters.";
      }
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = "Email address is required.";
      } else if (!emailRegex.test(value.trim())) {
        errorMsg = "Please enter a valid email address.";
      }
    } else if (fieldName === "phone") {
      if (value.trim()) {
        const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
        if (!phoneRegex.test(value.trim())) {
          errorMsg = "Please enter a valid phone number (at least 10 digits).";
        }
      }
    } else if (fieldName === "subject") {
      if (!value.trim()) {
        errorMsg = "Subject is required.";
      } else if (value.trim().length < 4) {
        errorMsg = "Subject must be at least 4 characters.";
      }
    } else if (fieldName === "message") {
      if (!value.trim()) {
        errorMsg = "Message details are required.";
      } else if (value.trim().length < 10) {
        errorMsg = "Please write a bit more detail (min 10 characters).";
      }
    } else if (fieldName === "antispam") {
      if (!value.trim()) {
        errorMsg = "Verification answer is required.";
      } else if (value.trim() !== "13") {
        errorMsg = "Incorrect answer. Hint: 5 + 8 = ?";
      }
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
    return !errorMsg;
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handleChange = (fieldName: string, value: string) => {
    if (fieldName === "name") setName(value);
    if (fieldName === "email") setEmail(value);
    if (fieldName === "phone") setPhone(value);
    if (fieldName === "subject") setSubject(value);
    if (fieldName === "message") setMessage(value);
    if (fieldName === "antispam") setAntispam(value);
    
    if (touched[fieldName as keyof typeof touched]) {
      validateField(fieldName, value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    // Mark all as touched
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      antispam: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const isNameValid = validateField("name", name);
    const isEmailValid = validateField("email", email);
    const isPhoneValid = validateField("phone", phone);
    const isSubjectValid = validateField("subject", subject);
    const isMessageValid = validateField("message", message);
    const isAntiSpamValid = validateField("antispam", antispam);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isSubjectValid || !isMessageValid || !isAntiSpamValid) {
      setFormError("Please correct the errors in the form before submitting.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactAction(null, formData);

      if (result?.error) {
        setFormError(result.error);
      } else if (result?.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setAntispam("");
        setErrors({});
        setTouched({});
        form.reset();
      }
    });
  };

  const departments = [
    { value: "Buyer Advisory", label: "Buyer Advisory Inquiry" },
    { value: "Seller Advisory", label: "Seller Representation" },
    { value: "Neighborhoods", label: "Neighborhood Intelligence" },
    { value: "Value Index", label: "Request Building Value Index Report" },
    { value: "General", label: "General Real Estate Inquiry" },
  ];

  const getFieldClass = (fieldName: keyof typeof errors) => {
    const baseClass = "block w-full rounded-md border bg-brand-black-rich px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-1";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-500/50 text-red-200 placeholder-red-300/40 focus:border-red-500 focus:ring-red-500`;
    }
    if (touched[fieldName] && !errors[fieldName] && ((fieldName === "phone" && phone) || fieldName !== "phone")) {
      return `${baseClass} border-emerald-500/50 text-emerald-200 focus:border-emerald-500 focus:ring-emerald-500`;
    }
    return `${baseClass} border-white/[0.08] text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:ring-brand-gold-premium`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Left Column: Contact details */}
      <div className="space-y-6 lg:col-span-1">
        <div className="glass-panel border-white/[0.05] rounded-xl p-6 space-y-6">
          <h3 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">
            Contact Information
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-gold-premium shrink-0" />
              <div>
                <p className="font-semibold text-brand-text-white">Brokerage Address</p>
                <p className="text-brand-text-secondary-gray mt-0.5 leading-relaxed">
                  102 Legend Dr, #202<br />
                  Sleepy Hollow, NY 10591
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand-gold-premium shrink-0" />
              <div>
                <p className="font-semibold text-brand-text-white">Email Address</p>
                <a href="mailto:hello@allrealtors.com" className="text-brand-text-secondary-gray hover:text-brand-text-white mt-0.5 block">
                  hello@allrealtors.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-gold-premium shrink-0" />
              <div>
                <p className="font-semibold text-brand-text-white">Phone Support</p>
                <a href="tel:+16466312220" className="text-brand-text-secondary-gray hover:text-brand-text-white mt-0.5 block">
                  +1 (646) 631-2220
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-brand-gold-premium shrink-0" />
              <div>
                <p className="font-semibold text-brand-text-white">Office Hours</p>
                <p className="text-brand-text-secondary-gray mt-0.5">
                  Monday - Friday: 9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Index CTA Block */}
        <div className="glass-panel border-brand-gold-premium/15 rounded-xl p-6 bg-brand-gold-premium/[0.02] space-y-4">
          <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand-gold-premium" />
            Request a Score Report
          </h4>
          <p className="text-xs text-brand-text-secondary-gray leading-relaxed font-sans">
            Want to know how a specific NYC condo building rates? We provide comprehensive 8-weighted assessment summaries on demand.
          </p>
          <button
            onClick={() => {
              setDepartment("Value Index");
            }}
            className="flex w-full items-center justify-center gap-2 rounded border border-brand-gold-premium/25 bg-brand-gold-premium/10 hover:bg-brand-gold-premium hover:text-brand-black-deep py-2.5 text-xs font-semibold tracking-wide text-brand-text-white transition-all"
          >
            Select Value Index Request
          </button>
        </div>
      </div>

      {/* 2. Right Columns: Contact Form */}
      <div className="lg:col-span-2">
        <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 relative">
          {success && (
            <div className="mb-6 rounded-md bg-emerald-950/20 border border-emerald-900/30 p-4 text-xs text-emerald-400 flex items-start gap-2.5">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wide">Submission Successful</span>
                Thank you! Your inquiry has been received. One of our advisors will contact you shortly.
              </div>
            </div>
          )}

          {formError && (
            <div className="mb-6 rounded-md bg-red-950/20 border border-red-900/30 p-4 text-xs text-red-400 flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wide">Error</span>
                {formError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={(e) => handleBlur("name", e.target.value)}
                  className={getFieldClass("name")}
                  placeholder="John Doe"
                />
                {touched.name && errors.name && (
                  <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  className={getFieldClass("email")}
                  placeholder="john@example.com"
                />
                {touched.email && errors.email && (
                  <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Phone and Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={(e) => handleBlur("phone", e.target.value)}
                  className={getFieldClass("phone")}
                  placeholder="+1 (555) 000-0000"
                />
                {touched.phone && errors.phone && (
                  <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.phone}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="department" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  Department / Interest *
                </label>
                <select
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich px-3 py-2.5 text-sm text-brand-text-white focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                >
                  {departments.map((dep) => (
                    <option key={dep.value} value={dep.value}>
                      {dep.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                Subject *
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                onBlur={(e) => handleBlur("subject", e.target.value)}
                className={getFieldClass("subject")}
                placeholder="e.g. Schedule strategy call / Request building audit"
              />
              {touched.subject && errors.subject && (
                <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.subject}
                </span>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                Inquiry Details *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={(e) => handleBlur("message", e.target.value)}
                className={getFieldClass("message")}
                placeholder="Please describe your buying/selling goals, preferred neighborhood, budget range, or specific building name..."
              />
              {touched.message && errors.message && (
                <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.message}
                </span>
              )}
            </div>

            {/* Anti-spam Check */}
            <div>
              <label htmlFor="antispam" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                Security Verification: What is 5 + 8? *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HelpCircle className="h-4 w-4 text-brand-text-secondary-gray" />
                </div>
                <input
                  id="antispam"
                  name="antispam"
                  type="text"
                  value={antispam}
                  onChange={(e) => handleChange("antispam", e.target.value)}
                  onBlur={(e) => handleBlur("antispam", e.target.value)}
                  className={getFieldClass("antispam")}
                  placeholder="Enter the number"
                />
              </div>
              {touched.antispam && errors.antispam && (
                <span className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.antispam}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-gradient py-2.5 text-sm font-semibold tracking-wide text-brand-black-deep hover:shadow-lg hover:shadow-brand-gold-premium/15 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Send Request"}
              {!isPending && <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
