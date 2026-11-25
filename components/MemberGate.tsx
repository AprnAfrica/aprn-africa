import Link from "next/link";

export default function MemberGate({ dark = false }: { dark?: boolean }) {
  return (
    <div className="relative">
      <div
        className="absolute -top-32 left-0 right-0 h-32 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${dark ? "#071B2A" : "#F5F7FA"})` }}
      />
      <div className="border-t-2 border-gold-500 py-16 px-8 text-center">
        <div className="max-w-md mx-auto">
          <i
            className="fa-solid fa-lock text-3xl mb-6 block"
            style={{ color: "#D4A017" }}
          />
          <h3
            className="text-2xl font-bold mb-3"
            style={{ color: dark ? "#ffffff" : "#071B2A", fontFamily: "var(--font-playfair), serif" }}
          >
            Member-Only Content
          </h3>
          <p className="text-sm leading-relaxed mb-8" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
            Create a free APRN account to access the full research library,
            intelligence briefings, and member network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ backgroundColor: "#D4A017", color: "#071B2A" }}
            >
              <i className="fa-solid fa-user-plus" />
              Create Free Account
            </Link>
            <Link
              href="/login"
              className={`inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-bold uppercase tracking-widest border transition-colors ${
                dark ? "border-white/20 text-slate-300 hover:bg-white/5" : "border-slate-300 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
