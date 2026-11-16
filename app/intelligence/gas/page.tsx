import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatusPill from "@/components/pipelines/StatusPill";
import {
  getPipelinesByFuel,
  COUNTRY_COUNTS,
  countryToSlug,
  CASE_STUDIES,
  type Pipeline,
} from "@/lib/pipelines/data";

export const metadata: Metadata = {
  title: "Gas Intelligence — Africa Gas Pipeline Infrastructure | APRN",
  description:
    "Africa's gas pipeline landscape: 229 named gas pipelines across 33 countries. Nigeria Decade of Gas context, NMDPRA open access regulations, and APRN case study analysis.",
  openGraph: {
    title: "Gas Intelligence — APRN Africa",
    description: "229 gas pipelines · Nigeria Decade of Gas · NMDPRA open access · AKK & ECOP case studies.",
    type: "website",
    url: "https://aprn-africa.org/intelligence/gas",
  },
};

// ── Stats computed at build time ──────────────────────────────────────────────

const gasPipelines = getPipelinesByFuel("Gas");

const gasByCountry = gasPipelines.reduce<Record<string, number>>((acc, p) => {
  p.countries.forEach((c) => { acc[c] = (acc[c] ?? 0) + 1; });
  return acc;
}, {});

const topGasCountries = Object.entries(gasByCountry)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8);

const gasStats = {
  total: gasPipelines.length,
  operating: gasPipelines.filter((p) => p.status === "operating").length,
  construction: gasPipelines.filter((p) => p.status === "construction").length,
  proposed: gasPipelines.filter((p) => p.status === "proposed").length,
  nigeriaCount: gasByCountry["Nigeria"] ?? 0,
  totalKm: gasPipelines.reduce((s, p) => s + (p.lengthKm ?? 0), 0),
};

// Featured gas corridors for the spotlight section
const FEATURED_GAS_SLUGS = [
  "trans-nigeria-gas-pipeline",
  "west-african-gas-pipeline",
  "nigeria-morocco-gas-pipeline",
  "trans-saharan-gas-pipeline",
  "escravos-lagos-pipeline-system-elps",
];

const featuredGas: Pipeline[] = FEATURED_GAS_SLUGS
  .map((slug) => gasPipelines.find((p) => p.slug === slug))
  .filter((p): p is Pipeline => !!p);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GasIntelligencePage() {
  const akk = CASE_STUDIES["trans-nigeria-gas-pipeline"];

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-12 border-b border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10">
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 18, letterSpacing: ".3px" }}>
            <Link href="/intelligence" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <span style={{ color: "#4a90c2" }}>Gas Infrastructure</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", border: "1px solid rgba(74,144,194,0.35)", background: "rgba(74,144,194,0.08)", marginBottom: 18 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a90c2", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#4a90c2", textTransform: "uppercase" }}>Gas Intelligence</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.75rem, 5vw, 3.375rem)", lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1", marginBottom: 20 }}>
                Africa&apos;s Gas Infrastructure
              </h1>
              <p style={{ fontSize: 15, color: "#9fb0bd", lineHeight: 1.7, maxWidth: 560 }}>
                A structured reference of natural gas pipelines across the continent — from Nigeria&apos;s dense domestic network to cross-Saharan export corridors. Built on GEM data, enriched with APRN analysis.
              </p>
            </div>
            <div className="flex gap-6 sm:gap-9 pt-4 sm:pt-0">
              {[
                [gasStats.total.toString(), "Gas Pipelines"],
                [Math.round(gasStats.totalKm / 1000).toLocaleString() + "k", "Km Mapped"],
                [gasStats.nigeriaCount.toString(), "In Nigeria"],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: 1, color: "#4a90c2" }}>{n}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nigeria: The Gas Giant */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="grid-cols-1 md:grid-cols-2">

            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
                The Imperative
              </p>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#e8edf1", lineHeight: 1.2, marginBottom: 20 }}>
                Nigeria: Decade of Gas
              </h2>
              <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75, marginBottom: 20 }}>
                Nigeria holds an estimated <strong style={{ color: "#e8edf1" }}>215 trillion cubic feet</strong> of natural gas reserves — the largest in Africa and roughly one-third of the continent&apos;s total deposits. Despite this, the country has historically flared or under-utilised associated gas while importing refined petroleum.
              </p>
              <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75, marginBottom: 20 }}>
                In 2021, Nigeria declared a <strong style={{ color: "#e8edf1" }}>Decade of Gas (2021–2030)</strong> — a strategic pivot to monetise gas reserves through domestic utilisation, gas-to-power, and LNG export. The regulatory architecture has shifted accordingly: the <strong style={{ color: "#e8edf1" }}>NMDPRA</strong> (Nigeria Midstream and Downstream Petroleum Regulatory Authority) now governs gas distribution, open access regulations, and grid expansion.
              </p>
              <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75 }}>
                NMDPRA is developing a <strong style={{ color: "#e8edf1" }}>gas distribution grid mapping</strong> and <strong style={{ color: "#e8edf1" }}>gas distribution master plan</strong> that will define where new pipelines will be built and how third parties can access existing infrastructure under open access rules.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
                Key Facts
              </p>
              {[
                { value: "215 TCF", label: "Natural gas reserves in Nigeria" },
                { value: "~⅓", label: "Share of Africa's total gas deposits held by Nigeria" },
                { value: "2021–2030", label: "Nigeria's declared Decade of Gas" },
                { value: "29", label: "Named gas pipelines in Nigeria tracked by APRN" },
                { value: "NMDPRA", label: "Regulator for Nigeria's midstream gas market" },
                { value: "Open access", label: "Policy direction — third-party pipeline access rights" },
              ].map(({ value, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 18, color: "#4a90c2", minWidth: 100, flexShrink: 0 }}>{value}</span>
                  <span style={{ fontSize: 13, color: "#9fb0bd", lineHeight: 1.5 }}>{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Gas types explained */}
      <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 20 }}>
            Gas Classification
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
            {[
              {
                icon: "fa-fire-flame-curved",
                title: "Associated Gas",
                desc: "Gas that comes out of the ground alongside crude oil during oil production. Historically flared in Nigeria — now being captured and monetised through gas gathering infrastructure connecting to the distribution network.",
              },
              {
                icon: "fa-circle-dot",
                title: "Non-Associated Gas",
                desc: "Dedicated gas deposits that exist independently of oil fields. Nigeria has substantial non-associated reserves that are the primary focus of new domestic gas infrastructure and the backbone of the Decade of Gas programme.",
              },
              {
                icon: "fa-arrows-left-right",
                title: "Open Access Infrastructure",
                desc: "NMDPRA is developing regulations requiring pipeline owners to allow third-party access — meaning gas producers and distributors can use existing pipeline capacity rather than building parallel infrastructure. Transforms the market structure.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ padding: "28px 28px", background: "#071B2A", borderRight: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ width: 36, height: 36, background: "rgba(74,144,194,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <i className={`fa-solid ${icon}`} style={{ color: "#4a90c2", fontSize: 14 }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline status breakdown */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>
              Status Breakdown — {gasStats.total} Gas Pipelines
            </p>
            <Link
              href="/intelligence/pipelines"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#4a90c2", textDecoration: "none" }}
              className="hover:text-gold-400 transition-colors"
            >
              View full database →
            </Link>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Operating", count: gasStats.operating, color: "#4a90c2" },
              { label: "Under Construction", count: gasStats.construction, color: "#D4A017" },
              { label: "Proposed", count: gasStats.proposed, color: "#C97A2B" },
              { label: "Other", count: gasStats.total - gasStats.operating - gasStats.construction - gasStats.proposed, color: "#7c8b98" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ padding: "16px 20px", border: "1px solid rgba(255,255,255,.07)", background: "#0D2436", minWidth: 130 }}>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 28, color, lineHeight: 1, marginBottom: 6 }}>{count}</div>
                <div style={{ fontSize: 11, color: "#7c8b98", letterSpacing: ".5px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured gas corridors */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 28 }}>
            Notable Gas Corridors
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
            {featuredGas.map((p, i) => (
              <Link
                key={p.slug}
                href={`/intelligence/pipelines/${countryToSlug(p.fromCountry)}/${p.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: "24px 26px",
                  background: "#0D2436",
                  borderRight: "1px solid rgba(255,255,255,.06)",
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                  position: "relative",
                }}
                className="group hover:bg-navy-700 transition-colors"
              >
                {CASE_STUDIES[p.slug] && (
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#D4A017", textTransform: "uppercase", border: "1px solid rgba(212,160,23,.3)", padding: "2px 8px", display: "inline-block", marginBottom: 12 }}>
                    APRN Case Study
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <StatusPill status={p.status} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#4a90c2", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {p.countries.length > 1 ? `${p.countries.length} countries` : p.fromCountry}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", lineHeight: 1.3, marginBottom: 10 }} className="group-hover:text-gold-500 transition-colors">
                  {p.name}
                </h3>
                {p.lengthKm && (
                  <p style={{ fontSize: 12, color: "#7c8b98" }}>{p.lengthKm.toLocaleString()} km</p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#4a90c2", marginTop: 16 }} className="group-hover:gap-3 transition-all">
                  View corridor <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AKK Case Study spotlight */}
      {akk && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#D4A017", textTransform: "uppercase", border: "1px solid rgba(212,160,23,.35)", padding: "3px 10px" }}>
                APRN Research Case Study
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="grid-cols-1 md:grid-cols-2">
              <div>
                <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#e8edf1", lineHeight: 1.2, marginBottom: 18 }}>
                  {akk.label}
                </h2>
                <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75, marginBottom: 16 }}>
                  {akk.significance}
                </p>
                <Link
                  href="/intelligence/pipelines/nigeria/trans-nigeria-gas-pipeline"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#4a90c2", textDecoration: "none", borderBottom: "1px solid rgba(74,144,194,.3)", paddingBottom: 2 }}
                >
                  View corridor page <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                </Link>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Research Focus</p>
                <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75, marginBottom: 24 }}>
                  {akk.researchFocus}
                </p>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Why AKK Was Chosen</p>
                <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75 }}>
                  {akk.whyChosen}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top gas countries */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 24 }}>
            Gas Pipelines by Country — Top 8
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
            {topGasCountries.map(([country, count], i) => (
              <Link
                key={country}
                href={`/intelligence/pipelines/${countryToSlug(country)}`}
                style={{ display: "block", textDecoration: "none", padding: "20px 22px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)" }}
                className="group hover:bg-navy-700 transition-colors"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#7c8b98", letterSpacing: ".5px" }}>#{i + 1}</span>
                  <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, color: "#4a90c2" }}>{count}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e8edf1", marginBottom: 4 }} className="group-hover:text-gold-500 transition-colors">{country}</p>
                <p style={{ fontSize: 11, color: "#7c8b98" }}>gas pipelines</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
              Full Database
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 28, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Explore all 229 gas pipelines
            </h2>
            <p style={{ fontSize: 14, color: "#9fb0bd", maxWidth: 480, lineHeight: 1.65 }}>
              Filter by country, status and operator across the full African gas pipeline network — or switch to crude oil to compare.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/intelligence/pipelines"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", background: "#4a90c2", color: "#071B2A" }}
              className="hover:opacity-90 transition-opacity"
            >
              Pipeline Database <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
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
