"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full px-4 py-3 text-white placeholder-slate-600 text-sm transition-all duration-300 focus:outline-none rounded-t-sm"
  + " bg-navy-800/40 border-0 border-b border-slate-500/30 focus:border-b-2 focus:border-gold-500";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-md bg-navy-800 border border-white/5 p-8 sm:p-10 shadow-2xl">
      <div>
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center justify-center mb-6 sm:mb-10">
          <Image
            src="/images/logo.png"
            alt="African Pipeline Resource Network"
            width={999}
            height={453}
            className="h-9 w-auto"
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome back{email.includes("@") ? `, ${email.split("@")[0].split(/[._-]/)[0].replace(/^\w/, (c) => c.toUpperCase())}` : ""}
          </h2>
          <p className="text-slate-400 text-sm">Sign in to your APRN member account</p>
        </div>

        {/* Alerts */}
        {searchParams.get("registered") && (
          <div className="mb-6 px-4 py-3 border border-gold-500/30 bg-gold-500/10 text-sm text-gold-400 rounded-sm">
            Account created. Check your email to confirm, then sign in.
          </div>
        )}
        {searchParams.get("error") === "auth_failed" && (
          <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-sm text-red-400 rounded-sm">
            Authentication failed. Please try again.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-slate-500 group-hover:border-gold-500 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-check text-[10px] text-transparent group-hover:text-gold-500" />
              </div>
              <span className="text-sm text-slate-400">Remember session</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-slate-400 hover:text-gold-500 transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-sm">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold py-4 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Or continue with</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* SSO buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-navy-900 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-colors text-sm font-medium text-white cursor-pointer"
          >
            <i className="fa-brands fa-google text-[#EA4335]" />
            Continue with Google
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
            Join APRN
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
