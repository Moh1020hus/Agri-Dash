"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // --- MOCK AUTHENTICATION LOGIC ---
    // Replace this with your actual API call (e.g., Supabase, NextAuth)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay

      if (formData.email === "demo@agri.com" && formData.password === "demo") {
        // Success: Redirect to Dashboard
        router.push("/");
      } else {
        throw new Error(
          "Ungültige Anmeldedaten. (Versuche: demo@agri.com / demo)",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-700 mb-4">
            <Sprout size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Willkommen zurück
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Melden Sie sich bei Ihrem AgriDash Account an
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                E-Mail Adresse
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                Passwort
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all shadow-sm",
                isLoading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Anmelden...
                </>
              ) : (
                <>
                  Anmelden <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer Helper */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Demo Zugang:{" "}
              <span className="font-mono text-slate-600">demo@agri.com</span> /{" "}
              <span className="font-mono text-slate-600">demo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
