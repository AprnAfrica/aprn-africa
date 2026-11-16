import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  MARKET_UPDATES_QUERY,
  MARKET_EDITORIALS_QUERY,
  type MarketUpdate,
  type MarketEditorial,
} from "@/lib/queries/intelligence";

export const metadata: Metadata = {
  title: "Market Intelligence — African Energy Markets | APRN",
  description:
    "APRN market intelligence: gas pricing dynamics, investment flows, capacity signals and regulatory market shifts across African energy infrastructure.",
  openGraph: {
    title: "Market Intelligence — APRN Africa",
    description:
      "Gas market dynamics · Investment flows · Capacity signals · Regulatory shifts. Curated market intelligence for African pipeline professionals.",
    type: "website",
    url: "https://aprn-africa.org/intelligence/market",
  },
};

const SIGNAL_TYPES = [
  {
    icon: "fa-chart-line",
    title: "Gas Market Dynamics",
    desc: "LNG spot pricing context, Nigerian domestic vs export gas balance, Decade of Gas monetisation progress, JKM/TTF spread implications for African LNG exporters.",
  },
  {
    icon: "fa-arrows-to-dot",
    title: "Investment Flows",
    desc: "FID decisions, financing close, CAPEX commitments and equity participation changes on major corridors. Who is putting capital in, and where it is being pulled.",
  },
  {
    icon: "fa-gauge-high",
    title: "Capacity & Utilisation",
    desc: "Throughput data, stranded capacity, load factors, and bottlenecks constraining gas-to-power and export targets. Where infrastructure is under or over its design basis.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Regulatory Market Shifts",
    desc: "NMDPRA open access tariff decisions, PSA renegotiations, cost recovery disputes, and cross-border transit regime changes that alter the commercial landscape.",
  },
] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function MarketIntelligencePage() {
  const [updates, editorials] = await Promise.all([
    sanityFetch<MarketUpdate[]>(MARKET_UPDATES_QUERY, {}, ["intelligence"]),
    sanityFetch<MarketEditorial[]>(MARKET_EDITORIALS_QUERY, {}, ["intelligence", "insights"]),
  ]);

  const featuredUpdates = updates.filter((u) => u.priority === "featured" || u.priority === "urgent");
  const regularUpdates = updates.filter((u) => u.priority === "normal");

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-12 border-b border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10">
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 18, letterSpacing: ".3px" }}>
            <Link href="/intelligence" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <span style={{ color: "#C97A2B" }}>Market Intelligence</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", border: "1px solid rgba(201,122,43,.35)", background: "rgba(201,122,43,.08)", marginBottom: 18 }}>
                <span style={{ width: 6, height: 6, background: "#C97A2B", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#C97A2B", textTransform: "uppercase" }}>Market Intelligence</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.75rem, 5vw, 3.375rem)", lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1", marginBottom: 20 }}>
                African Energy Markets
              </h1>
              <p style={{ fontSize: 15, color: "#9fb0bd", lineHeight: 1.7, maxWidth: 560 }}>
                Curated analysis of market signals shaping Africa&apos;s energy infrastructure — gas pricing dynamics, investment flows, capacity constraints and the regulatory decisions that redraw commercial boundaries.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
              <Link
                href="/dashboard/intelligence"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", background: "#C97A2B", color: "#071B2A" }}
                className="hover:opacity-90 transition-opacity"
              >
                Weekly Briefing <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
              </Link>
              <Link
                href="/membership"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(201,122,43,.3)", color: "#C97A2B" }}
                className="hover:bg-[rgba(201,122,43,.08)] transition-colors"
              >
                Member Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signal types */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 24 }}>
            What We Track
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
            {SIGNAL_TYPES.map(({ icon, title, desc }) => (
              <div key={title} style={{ padding: "26px 26px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ width: 36, height: 36, background: "rgba(201,122,43,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <i className={`fa-solid ${icon}`} style={{ color: "#C97A2B", fontSize: 14 }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / urgent updates */}
      {featuredUpdates.length > 0 && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-10">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 20 }}>
              Flagged Signals
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {featuredUpdates.map((u) => (
                <div key={u._id} style={{ padding: "20px 24px", background: "#071B2A", borderLeft: `3px solid ${u.priority === "urgent" ? "#ef4444" : "#D4A017"}`, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "2px 8px", background: u.priority === "urgent" ? "rgba(239,68,68,.12)" : "rgba(212,160,23,.12)", color: u.priority === "urgent" ? "#ef4444" : "#D4A017", border: `1px solid ${u.priority === "urgent" ? "rgba(239,68,68,.3)" : "rgba(212,160,23,.3)"}` }}>
                      {u.priority === "urgent" ? "Urgent" : "Featured"}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", marginBottom: 6, lineHeight: 1.4 }}>{u.headline}</p>
                    {u.summary && <p style={{ fontSize: 13, color: "#9fb0bd", lineHeight: 1.6 }}>{u.summary}</p>}
                    <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: "#7c8b98" }}>
                      {u.corridorName && <span style={{ color: "#C97A2B" }}>{u.corridorName}</span>}
                      <span>{formatDate(u.publishedAt)}</span>
                      {u.externalUrl && (
                        <a href={u.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#D4A017", textDecoration: "none" }}>
                          Source ↗
                        </a>
                      )}
                      {u.slug && (
                        <Link href={`/insights/${u.slug}`} style={{ color: "#D4A017", textDecoration: "none" }}>
                          Full brief →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main updates feed */}
      {regularUpdates.length > 0 ? (
        <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>
                Market Updates
              </p>
              <Link href="/insights" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C97A2B", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">
                Full intelligence feed →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {regularUpdates.map((u, i) => (
                <div key={u._id} style={{ padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7c8b98", minWidth: 90, paddingTop: 2 }}>{formatDate(u.publishedAt)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#e8edf1", marginBottom: 4, lineHeight: 1.4 }}>{u.headline}</p>
                    {u.summary && <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6 }}>{u.summary}</p>}
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#7c8b98" }}>
                      {u.corridorName && <span style={{ color: "#C97A2B" }}>{u.corridorName}</span>}
                      {u.externalUrl && (
                        <a href={u.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#7c8b98", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">
                          Source ↗
                        </a>
                      )}
                      {u.slug && (
                        <Link href={`/insights/${u.slug}`} style={{ color: "#7c8b98", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">
                          Read brief →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 20 }}>
              Market Updates
            </p>
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <i className="fa-regular fa-chart-line" style={{ fontSize: 28, color: "#2d4a5c", marginBottom: 16, display: "block" }} />
              <p style={{ fontSize: 14, color: "#7c8b98", lineHeight: 1.6 }}>
                Market intelligence updates are published as new signals emerge.<br />
                <Link href="/dashboard/intelligence" style={{ color: "#C97A2B", textDecoration: "none" }}>Subscribe to the weekly briefing</Link> to receive them first.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Editorial analysis */}
      {editorials.length > 0 && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>
                Editorial Analysis
              </p>
              <Link href="/insights" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C97A2B", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">
                All editorials →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
              {editorials.map((e) => (
                <Link
                  key={e._id}
                  href={`/insights/${e.slug}`}
                  style={{ display: "block", textDecoration: "none", padding: "24px 26px", background: "#071B2A", borderRight: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)" }}
                  className="group hover:bg-navy-700 transition-colors"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C97A2B", border: "1px solid rgba(201,122,43,.25)", padding: "2px 8px" }}>Editorial</span>
                    <span style={{ fontSize: 11, color: "#7c8b98" }}>{formatDate(e.publishDate)}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", lineHeight: 1.35, marginBottom: 10 }} className="group-hover:text-gold-500 transition-colors">
                    {e.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6, marginBottom: 14 }}>
                    {e.excerpt?.length > 120 ? e.excerpt.slice(0, 120) + "…" : e.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#C97A2B" }} className="group-hover:gap-3 transition-all">
                    Read analysis <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Members CTA */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
              Member Access
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 28, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Weekly market briefings
            </h2>
            <p style={{ fontSize: 14, color: "#9fb0bd", maxWidth: 480, lineHeight: 1.65 }}>
              APRN members receive structured weekly briefings that synthesise market signals into actionable intelligence — project updates, pricing context, regulatory developments, and investment flow analysis.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/membership"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", background: "#D4A017", color: "#071B2A" }}
              className="hover:bg-gold-400 transition-colors"
            >
              Join Network <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </Link>
            <Link
              href="/intelligence"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,.15)", color: "#9fb0bd" }}
              className="hover:border-white/30 transition-colors"
            >
              Intelligence Hub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
