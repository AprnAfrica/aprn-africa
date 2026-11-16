import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  POLICY_UPDATES_QUERY,
  POLICY_FRAMEWORKS_QUERY,
  POLICY_EDITORIALS_QUERY,
  type PolicyUpdate,
  type PolicyFramework,
  type PolicyEditorial,
} from "@/lib/queries/intelligence";

export const metadata: Metadata = {
  title: "Policy Tracker — African Energy Regulation | APRN",
  description:
    "APRN Policy Tracker: regulatory frameworks, open access rules, PSA terms and fiscal regimes shaping African pipeline and gas infrastructure markets.",
  openGraph: {
    title: "Policy Tracker — APRN Africa",
    description:
      "AU · ECOWAS · NMDPRA · NUPRC. Track the regulatory decisions that redraw Africa's energy landscape.",
    type: "website",
    url: "https://aprn-africa.org/intelligence/policy",
  },
};

const FRAMEWORK_TYPE_LABEL: Record<string, string> = {
  AU:         "African Union",
  ECOWAS:     "ECOWAS",
  EAC:        "East African Community",
  SADC:       "SADC",
  COMESA:     "COMESA",
  bilateral:  "Bilateral",
  national:   "National Policy",
  industry:   "Industry Standard",
};

const REGULATORS = [
  {
    code: "NMDPRA",
    name: "Nigeria Midstream & Downstream Petroleum Regulatory Authority",
    country: "Nigeria",
    scope: "Gas distribution, open access pipeline regulations, gas grid master plan, third-party access tariffs.",
    relevance: "Core to Nigeria's Decade of Gas — setting the commercial terms for who can access existing gas infrastructure.",
  },
  {
    code: "NUPRC",
    name: "Nigerian Upstream Petroleum Regulatory Commission",
    country: "Nigeria",
    scope: "Upstream oil and gas licensing, field development approvals, associated gas management obligations.",
    relevance: "Governs the asset base feeding the gas distribution network NMDPRA regulates.",
  },
  {
    code: "ECOWAS",
    name: "Economic Community of West African States",
    country: "West Africa",
    scope: "ECOWAS Energy Protocol, cross-border pipeline transit regimes, West African Power Pool integration.",
    relevance: "Defines the framework under which trans-boundary pipelines like WAGP and NMGP operate.",
  },
  {
    code: "AU",
    name: "African Union — Africa Energy Commission",
    country: "Continental",
    scope: "AU Agenda 2063 energy access goals, PIDA cross-border energy infrastructure framework.",
    relevance: "Sets the continental strategic context for cross-border gas and electricity corridor investment.",
  },
  {
    code: "EAC",
    name: "East African Community",
    country: "East Africa",
    scope: "EACOP inter-governmental agreement, EAC energy protocol, electricity market integration.",
    relevance: "Governance framework for EACOP and future east African gas infrastructure.",
  },
] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function PolicyTrackerPage() {
  const [updates, frameworks, editorials] = await Promise.all([
    sanityFetch<PolicyUpdate[]>(POLICY_UPDATES_QUERY, {}, ["intelligence"]),
    sanityFetch<PolicyFramework[]>(POLICY_FRAMEWORKS_QUERY, {}, ["intelligence"]),
    sanityFetch<PolicyEditorial[]>(POLICY_EDITORIALS_QUERY, {}, ["intelligence", "insights"]),
  ]);

  const urgentUpdates = updates.filter((u) => u.priority === "urgent" || u.priority === "featured");
  const regularUpdates = updates.filter((u) => u.priority === "normal");

  const activeFrameworks = frameworks.filter((f) => f.inForce);
  const inactiveFrameworks = frameworks.filter((f) => !f.inForce);

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-12 border-b border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10">
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 18, letterSpacing: ".3px" }}>
            <Link href="/intelligence" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <span style={{ color: "#D4A017" }}>Policy Tracker</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", border: "1px solid rgba(212,160,23,.35)", background: "rgba(212,160,23,.07)", marginBottom: 18 }}>
                <i className="fa-solid fa-scale-balanced" style={{ color: "#D4A017", fontSize: 10 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>Policy Tracker</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.75rem, 5vw, 3.375rem)", lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1", marginBottom: 20 }}>
                Regulatory Frameworks
              </h1>
              <p style={{ fontSize: 15, color: "#9fb0bd", lineHeight: 1.7, maxWidth: 560 }}>
                APRN tracks the regulatory decisions, policy frameworks and open access rules that define commercial terms for African pipeline and gas infrastructure. From NMDPRA open access tariffs to ECOWAS transit protocols — the rules that determine who can build, own and access infrastructure.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
              <Link
                href="/dashboard/intelligence"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", background: "#D4A017", color: "#071B2A" }}
                className="hover:bg-gold-400 transition-colors"
              >
                Policy Briefings <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why regulation matters */}
      <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
                Why It Matters
              </p>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", color: "#e8edf1", lineHeight: 1.2, marginBottom: 18 }}>
                Open access changes everything
              </h2>
              <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75, marginBottom: 16 }}>
                In a pipeline system without open access rules, the owner of the pipe controls who can move gas through it. Nigeria is developing mandatory third-party access regulations under the NMDPRA — requiring pipeline owners to allow competitors to use their capacity at regulated tariffs.
              </p>
              <p style={{ fontSize: 14, color: "#9fb0bd", lineHeight: 1.75 }}>
                When open access is implemented, it shifts the gas market from vertically-integrated incumbents to a competitive supply model. It determines whether independent gas producers can monetise reserves, whether gas-to-power projects can secure supply, and ultimately whether Nigeria&apos;s Decade of Gas produces real market development or just more stranded capacity.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
                Key Policy Areas
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { icon: "fa-door-open", label: "Open Access", desc: "Third-party pipeline access rights and tariff setting" },
                  { icon: "fa-file-contract", label: "PSA Terms", desc: "Production sharing agreement conditions and cost recovery rules" },
                  { icon: "fa-coins", label: "Fiscal Regimes", desc: "Royalties, petroleum profits tax, and gas pricing regulations" },
                  { icon: "fa-arrows-left-right-to-line", label: "Transit Regimes", desc: "Cross-border pipeline access and host country obligations" },
                  { icon: "fa-shield-halved", label: "Integrity Standards", desc: "Safety codes, inspection mandates, and liability frameworks" },
                ].map(({ icon, label, desc }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width: 32, height: 32, background: "rgba(212,160,23,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <i className={`fa-solid ${icon}`} style={{ color: "#D4A017", fontSize: 12 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8edf1", marginBottom: 3 }}>{label}</p>
                      <p style={{ fontSize: 12, color: "#7c8b98" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulators we track */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-12">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 24 }}>
            Regulators We Track
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)" }}>
            {REGULATORS.map((r) => (
              <div key={r.code} style={{ padding: "24px 26px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", color: "#D4A017", background: "rgba(212,160,23,.1)", padding: "3px 10px", border: "1px solid rgba(212,160,23,.2)" }}>{r.code}</span>
                  <span style={{ fontSize: 10, color: "#7c8b98", letterSpacing: ".5px" }}>{r.country}</span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#e8edf1", lineHeight: 1.35, marginBottom: 10 }}>{r.name}</h3>
                <p style={{ fontSize: 12, color: "#7c8b98", lineHeight: 1.6, marginBottom: 10 }}>{r.scope}</p>
                <p style={{ fontSize: 12, color: "#9fb0bd", lineHeight: 1.6, borderLeft: "2px solid rgba(212,160,23,.3)", paddingLeft: 10 }}>{r.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent policy updates */}
      {urgentUpdates.length > 0 && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-10">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 20 }}>
              Flagged Developments
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {urgentUpdates.map((u) => (
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
                      {u.externalUrl && <a href={u.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#D4A017", textDecoration: "none" }}>Source ↗</a>}
                      {u.slug && <Link href={`/insights/${u.slug}`} style={{ color: "#D4A017", textDecoration: "none" }}>Full brief →</Link>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Policy updates feed */}
      {regularUpdates.length > 0 ? (
        <section style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>
                Policy Updates
              </p>
              <Link href="/insights" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#D4A017", textDecoration: "none" }} className="hover:text-gold-400 transition-colors">
                Full intelligence feed →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {regularUpdates.map((u) => (
                <div key={u._id} style={{ padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7c8b98", minWidth: 90, paddingTop: 2 }}>{formatDate(u.publishedAt)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#e8edf1", marginBottom: 4, lineHeight: 1.4 }}>{u.headline}</p>
                    {u.summary && <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6 }}>{u.summary}</p>}
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#7c8b98" }}>
                      {u.corridorName && <span style={{ color: "#C97A2B" }}>{u.corridorName}</span>}
                      {u.externalUrl && <a href={u.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#7c8b98", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">Source ↗</a>}
                      {u.slug && <Link href={`/insights/${u.slug}`} style={{ color: "#7c8b98", textDecoration: "none" }} className="hover:text-gold-500 transition-colors">Read brief →</Link>}
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
              Policy Updates
            </p>
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <i className="fa-regular fa-scale-balanced" style={{ fontSize: 28, color: "#2d4a5c", marginBottom: 16, display: "block" }} />
              <p style={{ fontSize: 14, color: "#7c8b98", lineHeight: 1.6 }}>
                Policy intelligence updates publish as regulatory decisions emerge.<br />
                <Link href="/dashboard/intelligence" style={{ color: "#D4A017", textDecoration: "none" }}>Subscribe to the weekly briefing</Link> to receive them first.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Editorial analysis — Tokunbo's articles */}
      {editorials.length > 0 && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase" }}>
                Editorial Analysis
              </p>
              <Link href="/insights" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#D4A017", textDecoration: "none" }} className="hover:text-gold-400 transition-colors">
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
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#D4A017", border: "1px solid rgba(212,160,23,.25)", padding: "2px 8px" }}>Editorial</span>
                    <span style={{ fontSize: 11, color: "#7c8b98" }}>{formatDate(e.publishDate)}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf1", lineHeight: 1.35, marginBottom: 10 }} className="group-hover:text-gold-500 transition-colors">
                    {e.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6, marginBottom: 14 }}>
                    {e.excerpt?.length > 120 ? e.excerpt.slice(0, 120) + "…" : e.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#D4A017" }} className="group-hover:gap-3 transition-all">
                    Read analysis <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Frameworks from Sanity */}
      {(activeFrameworks.length > 0 || inactiveFrameworks.length > 0) && (
        <section style={{ background: "#0D2436", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            {activeFrameworks.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 24 }}>
                  Active Frameworks
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.06)", marginBottom: 40 }}>
                  {activeFrameworks.map((f) => (
                    <div key={f._id} style={{ padding: "24px 26px", background: "#071B2A", borderRight: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#4a90c2", textTransform: "uppercase", border: "1px solid rgba(74,144,194,.25)", padding: "2px 8px" }}>
                          {FRAMEWORK_TYPE_LABEL[f.frameworkType] ?? f.frameworkType}
                        </span>
                        {f.dateAdopted && <span style={{ fontSize: 10, color: "#7c8b98" }}>{f.dateAdopted.slice(0, 4)}</span>}
                        {f.countriesCount > 0 && <span style={{ fontSize: 10, color: "#7c8b98" }}>{f.countriesCount} countries</span>}
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e8edf1", lineHeight: 1.35, marginBottom: 10 }}>{f.title}</h3>
                      <p style={{ fontSize: 12, color: "#7c8b98", lineHeight: 1.65 }}>
                        {f.summary.length > 180 ? f.summary.slice(0, 180) + "…" : f.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {inactiveFrameworks.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 20 }}>
                  Historical / Superseded
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, border: "1px solid rgba(255,255,255,.04)", opacity: .6 }}>
                  {inactiveFrameworks.map((f) => (
                    <div key={f._id} style={{ padding: "20px 24px", background: "#071B2A", borderRight: "1px solid rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#7c8b98", textTransform: "uppercase", border: "1px solid rgba(255,255,255,.1)", padding: "2px 8px" }}>
                          {FRAMEWORK_TYPE_LABEL[f.frameworkType] ?? f.frameworkType}
                        </span>
                        {f.dateAdopted && <span style={{ fontSize: 10, color: "#7c8b98" }}>{f.dateAdopted.slice(0, 4)}</span>}
                      </div>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#9fb0bd", lineHeight: 1.35 }}>{f.title}</h3>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Members CTA */}
      <section>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
              Member Access
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 28, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Policy briefings for APRN members
            </h2>
            <p style={{ fontSize: 14, color: "#9fb0bd", maxWidth: 480, lineHeight: 1.65 }}>
              Members receive structured analysis of regulatory decisions — open access tariff changes, licensing round outcomes, PSA renegotiations — and their practical implications for project economics and workforce planning.
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
