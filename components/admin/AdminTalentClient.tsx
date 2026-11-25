"use client";

import { useState, useMemo } from "react";
import type { Database } from "@/types/database";

type Application = Database["public"]["Tables"]["talent_applications"]["Row"];

const STATUSES = ["all", "submitted", "under_review", "shortlisted", "accepted", "rejected"] as const;

const STATUS_BADGE: Record<string, string> = {
  submitted:    "bg-blue-400/10 text-blue-400 border-blue-400/20",
  under_review: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  shortlisted:  "bg-violet-400/10 text-violet-400 border-violet-400/20",
  accepted:     "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  rejected:     "bg-red-400/10 text-red-400 border-red-400/20",
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export default function AdminTalentClient({ applications: initial }: { applications: Application[] }) {
  const [apps, setApps] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [drawerStatus, setDrawerStatus] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((a) => {
      const matchText = !q ||
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.university.toLowerCase().includes(q) ||
        a.discipline.toLowerCase().includes(q);
      return matchText && (statusFilter === "all" || a.status === statusFilter);
    });
  }, [apps, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  function openDrawer(app: Application) {
    setSelected(app);
    setDrawerStatus(app.status);
    setDrawerNotes(app.reviewer_notes ?? "");
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/talent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: drawerStatus,
          reviewer_notes: drawerNotes || null,
        }),
      });
      if (!res.ok) throw new Error();
      setApps((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, status: drawerStatus, reviewer_notes: drawerNotes || null, reviewed_at: new Date().toISOString() }
            : a
        )
      );
      setSelected((prev) =>
        prev ? { ...prev, status: drawerStatus, reviewer_notes: drawerNotes || null, reviewed_at: new Date().toISOString() } : null
      );
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "University", "Discipline", "Graduation Year", "Employed", "Employer", "Status", "Submitted"];
    const rows = filtered.map((a) => [
      a.full_name, a.email, a.phone, a.university, a.discipline,
      String(a.graduation_year), a.currently_employed ? "Yes" : "No",
      a.employer ?? "", a.status, formatDate(a.submitted_at),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talent-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-360 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">Talent Applications</h1>
            <p className="text-sm text-slate-500 mt-1">
              Pipeline Talent Initiative — review and manage applicants
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 px-4 py-2 text-xs font-medium transition-colors"
          >
            <i className="fa-solid fa-file-csv" />
            Export CSV
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {(["all", "submitted", "under_review", "shortlisted", "accepted", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`p-4 border text-left transition-colors ${
                statusFilter === s
                  ? "bg-navy-800 border-gold-500/30"
                  : "bg-navy-800 border-white/5 hover:border-white/10"
              }`}
            >
              <p className="text-2xl font-bold text-white">{counts[s] ?? 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-1">
                {s === "all" ? "Total" : STATUS_LABEL[s]}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              className="w-full bg-navy-800 border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50"
              placeholder="Search by name, email, university, or discipline…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Name", "University", "Discipline", "Year", "Status", "Submitted"].map((h) => (
                  <th key={h} className="text-[10px] font-bold tracking-widest text-slate-500 uppercase text-left py-3 px-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => openDrawer(app)}
                  className="border-b border-white/5 hover:bg-navy-800 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="text-white font-medium">{app.full_name}</p>
                    <p className="text-xs text-slate-500">{app.email}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{app.university}</td>
                  <td className="py-3 px-3 text-slate-400">{app.discipline}</td>
                  <td className="py-3 px-3 text-slate-400">{app.graduation_year}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${STATUS_BADGE[app.status]}`}>
                      {STATUS_LABEL[app.status]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-xs">{timeAgo(app.submitted_at)}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    {apps.length === 0
                      ? "No applications yet — share the talent page to start receiving submissions."
                      : "No applications match your filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 text-xs border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-xs border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Drawer ───────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-140 bg-navy-900 border-l border-white/5 overflow-y-auto">
            <div className="sticky top-0 bg-navy-900 border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white">{selected.full_name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Contact */}
              <DrawerSection title="Contact">
                <DrawerRow label="Email" value={selected.email} />
                <DrawerRow label="Phone" value={selected.phone} />
              </DrawerSection>

              {/* Academic */}
              <DrawerSection title="Academic Background">
                <DrawerRow label="University" value={selected.university} />
                <DrawerRow label="Discipline" value={selected.discipline} />
                <DrawerRow label="Graduation" value={String(selected.graduation_year)} />
                <DrawerRow label="Employed" value={selected.currently_employed ? `Yes — ${selected.employer ?? ""}` : "No"} />
              </DrawerSection>

              {/* Motivation */}
              <DrawerSection title="Motivation">
                <MotivationAnswer label="Why pipeline engineering?" text={selected.why_pipelines} />
                <MotivationAnswer label="Why pipelines matter" text={selected.why_pipelines_matter} />
                <MotivationAnswer label="Why APRN?" text={selected.why_aprn} />
                <MotivationAnswer label="Contribution to Africa" text={selected.contribution_to_africa} />
              </DrawerSection>

              {/* Documents */}
              <DrawerSection title="Documents">
                <DocumentLink label="Degree Certificate" path={selected.degree_cert_path} />
                <DocumentLink label="NYSC Certificate" path={selected.nysc_cert_path} />
                {selected.employment_letter_path && (
                  <DocumentLink label="Employment Letter" path={selected.employment_letter_path} />
                )}
              </DrawerSection>

              {/* Review */}
              <DrawerSection title="Review">
                <div className="mb-4">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                  <select
                    className="w-full bg-navy-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-gold-500/50 appearance-none"
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value)}
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">Reviewer Notes</label>
                  <textarea
                    className="w-full bg-navy-800 border border-white/10 text-white text-sm px-3 py-2 min-h-24 resize-y focus:outline-none focus:border-gold-500/50"
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Internal notes about this applicant…"
                  />
                </div>
                {selected.reviewed_at && (
                  <p className="text-xs text-slate-500 mb-4">
                    Last reviewed {formatDate(selected.reviewed_at)} by {selected.reviewed_by ?? "—"}
                  </p>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest py-3 text-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Review"}
                </button>
              </DrawerSection>

              {/* Meta */}
              <div className="text-xs text-slate-600 space-y-1 pt-4 border-t border-white/5">
                <p>Application ID: <span className="font-mono text-slate-500">{selected.id}</span></p>
                <p>Submitted: {formatDate(selected.submitted_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Drawer helpers ─────────────────────────────────────────── */

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">{title}</h3>
      {children}
    </div>
  );
}

function DrawerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 w-24 shrink-0 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-slate-300">{value}</span>
    </div>
  );
}

function MotivationAnswer({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function DocumentLink({ label, path }: { label: string; path: string }) {
  const filename = path.split("/").pop() ?? path;
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-400 font-mono">{filename}</p>
      </div>
      <a
        href={`/api/admin/talent/download?path=${encodeURIComponent(path)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold-500 hover:text-gold-400 text-xs font-medium transition-colors"
      >
        <i className="fa-solid fa-download mr-1" />
        Download
      </a>
    </div>
  );
}
