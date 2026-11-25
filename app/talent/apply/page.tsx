"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { talentApplicationSchema } from "@/lib/validation";

type Step = 1 | 2 | 3 | 4;

const DISCIPLINES = [
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Environmental Engineering",
  "Mechanical Engineering",
  "Metallurgical & Materials Engineering",
  "Petroleum & Gas Engineering",
  "Pipeline Engineering",
  "Structural Engineering",
  "Other Engineering",
];

const GRAD_YEARS = [2026, 2025, 2024, 2023, 2022, 2021];

const MOTIVATION_QUESTIONS = [
  {
    key: "whyPipelines" as const,
    label: "Why pipeline engineering?",
    prompt: "Why do you want to pursue a career in the pipeline industry?",
  },
  {
    key: "whyPipelinesMatter" as const,
    label: "Why pipelines matter",
    prompt:
      "What do you understand about the importance and benefits of pipeline infrastructure to Africa's energy industry?",
  },
  {
    key: "whyAprn" as const,
    label: "Why APRN?",
    prompt:
      "Why do you want to be part of the African Pipeline Research Network and its mission?",
  },
  {
    key: "contributionToAfrica" as const,
    label: "Your contribution to Africa",
    prompt:
      "How do you see yourself contributing to Africa's pipeline infrastructure development, energy security, and industrial growth?",
  },
];

export default function TalentApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // step 1 — eligibility
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [currentlyEmployed, setCurrentlyEmployed] = useState(false);
  const [employer, setEmployer] = useState("");

  // step 2 — motivation (tracked as state for validation)
  const [whyPipelines, setWhyPipelines] = useState("");
  const [whyPipelinesMatter, setWhyPipelinesMatter] = useState("");
  const [whyAprn, setWhyAprn] = useState("");
  const [contributionToAfrica, setContributionToAfrica] = useState("");

  // step 3 — files
  const [degreeCert, setDegreeCert] = useState<File | null>(null);
  const [nyscCert, setNyscCert] = useState<File | null>(null);
  const [employmentLetter, setEmploymentLetter] = useState<File | null>(null);

  const motivationState = {
    whyPipelines,
    whyPipelinesMatter,
    whyAprn,
    contributionToAfrica,
  };
  const motivationSetters = {
    whyPipelines: setWhyPipelines,
    whyPipelinesMatter: setWhyPipelinesMatter,
    whyAprn: setWhyAprn,
    contributionToAfrica: setContributionToAfrica,
  };

  function validateStep1(): string | null {
    if (!fullName.trim()) return "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      return "Valid email is required";
    if (!phone.trim() || phone.length < 7) return "Valid phone number is required";
    if (!university.trim()) return "University is required";
    if (!discipline) return "Select your engineering discipline";
    if (!graduationYear) return "Select your graduation year";
    return null;
  }

  function validateStep2(): string | null {
    for (const q of MOTIVATION_QUESTIONS) {
      const val = motivationState[q.key];
      if (!val || val.trim().length < 50)
        return `"${q.label}" requires at least 50 characters`;
    }
    return null;
  }

  function validateStep3(): string | null {
    if (!degreeCert) return "Degree certificate is required";
    if (!nyscCert) return "NYSC certificate is required";
    return null;
  }

  function handleNext() {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(4);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setError("");
    setStep((s) => Math.max(1, s - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = talentApplicationSchema.safeParse({
      fullName,
      email,
      phone,
      university,
      discipline,
      graduationYear,
      currentlyEmployed,
      employer: employer || undefined,
      ...motivationState,
    });
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0];
      setError(first?.[0] ?? "Validation failed");
      return;
    }

    const fd = new FormData();
    fd.set("fullName", fullName);
    fd.set("email", email);
    fd.set("phone", phone);
    fd.set("university", university);
    fd.set("discipline", discipline);
    fd.set("graduationYear", graduationYear);
    fd.set("currentlyEmployed", String(currentlyEmployed));
    if (employer) fd.set("employer", employer);
    fd.set("whyPipelines", whyPipelines);
    fd.set("whyPipelinesMatter", whyPipelinesMatter);
    fd.set("whyAprn", whyAprn);
    fd.set("contributionToAfrica", contributionToAfrica);
    if (degreeCert) fd.set("degreeCert", degreeCert);
    if (nyscCert) fd.set("nyscCert", nyscCert);
    if (employmentLetter) fd.set("employmentLetter", employmentLetter);

    setSubmitting(true);
    try {
      const res = await fetch("/api/talent/apply", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Submission failed");
        return;
      }
      setAppId(json.applicationId);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-navy-800 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";
  const selectClass = `${inputClass} appearance-none`;

  if (submitted) {
    return (
      <>
        <Navigation />
        <main className="bg-navy-900 min-h-screen pt-32 pb-24">
          <div className="mx-auto max-w-160 px-4 sm:px-8 text-center">
            <div className="w-20 h-20 bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
              <i className="fa-solid fa-check text-gold-500 text-3xl" />
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Application Submitted
            </h1>
            <p className="text-slate-400 mb-6 max-w-120 mx-auto">
              Your application for the APRN Pipeline Training Programme has
              been received. We will review your submission and contact you
              at <strong className="text-white">{email}</strong>.
            </p>
            <div className="bg-navy-800 border border-white/5 p-6 max-w-100 mx-auto mb-10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Application Reference
              </p>
              <p className="text-gold-500 font-mono text-sm break-all">
                {appId}
              </p>
            </div>
            <Link
              href="/talent"
              className="inline-flex items-center gap-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold uppercase tracking-widest px-8 py-3 text-sm transition-colors"
            >
              <i className="fa-solid fa-arrow-left" />
              Back to Programme
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-200 px-4 sm:px-8">
          {/* header */}
          <Link
            href="/talent"
            className="text-sm text-slate-500 hover:text-gold-500 transition-colors inline-flex items-center gap-1.5 mb-8"
          >
            <i className="fa-solid fa-arrow-left" />
            Back to programme
          </Link>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Apply — Pipeline Training Programme
          </h1>
          <p className="text-slate-400 mb-10">
            All fields marked with * are required.
          </p>

          {/* step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {(
              [
                "Personal Info",
                "Motivation",
                "Documents",
                "Review",
              ] as const
            ).map((label, i) => {
              const n = (i + 1) as Step;
              const active = n === step;
              const done = n < step;
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      active
                        ? "bg-gold-500 text-navy-900"
                        : done
                          ? "bg-gold-500/20 text-gold-500"
                          : "bg-navy-800 text-slate-500 border border-white/10"
                    }`}
                  >
                    {done ? (
                      <i className="fa-solid fa-check" />
                    ) : (
                      n
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      active ? "text-gold-500" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 3 && (
                    <div
                      className={`flex-1 h-px ${
                        done ? "bg-gold-500/30" : "bg-white/5"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-6">
              <i className="fa-solid fa-triangle-exclamation mr-2" />
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* ── STEP 1: Personal Info ────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      className={inputClass}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Adebayo Okafor"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 ..."
                    />
                  </div>
                  <div>
                    <label className={labelClass}>University *</label>
                    <input
                      className={inputClass}
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. University of Lagos"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Engineering Discipline *
                    </label>
                    <select
                      className={selectClass}
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                    >
                      <option value="">Select discipline</option>
                      {DISCIPLINES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Graduation Year *</label>
                    <select
                      className={selectClass}
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    >
                      <option value="">Select year</option>
                      {GRAD_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentlyEmployed}
                      onChange={(e) =>
                        setCurrentlyEmployed(e.target.checked)
                      }
                      className="w-4 h-4 accent-gold-500"
                    />
                    <span className="text-sm text-slate-300">
                      I am currently employed
                    </span>
                  </label>
                </div>

                {currentlyEmployed && (
                  <div>
                    <label className={labelClass}>Employer</label>
                    <input
                      className={inputClass}
                      value={employer}
                      onChange={(e) => setEmployer(e.target.value)}
                      placeholder="Company or organisation name"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Motivation ───────────────────────── */}
            {step === 2 && (
              <div className="space-y-8">
                <p className="text-sm text-slate-400">
                  Answer each question thoughtfully. These responses help us
                  understand your commitment to the pipeline industry and
                  APRN&apos;s mission. Minimum 50 characters each.
                </p>
                {MOTIVATION_QUESTIONS.map((q) => (
                  <div key={q.key}>
                    <label className={labelClass}>{q.label} *</label>
                    <p className="text-xs text-slate-500 mb-2">{q.prompt}</p>
                    <textarea
                      className={`${inputClass} min-h-32 resize-y`}
                      value={motivationState[q.key]}
                      onChange={(e) =>
                        motivationSetters[q.key](e.target.value)
                      }
                      maxLength={2000}
                    />
                    <p className="text-xs text-slate-600 mt-1 text-right">
                      {motivationState[q.key].length} / 2,000
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 3: Documents ────────────────────────── */}
            {step === 3 && (
              <div className="space-y-8">
                <p className="text-sm text-slate-400">
                  Upload clear scans or photos of your certificates. Accepted
                  formats: PDF, JPEG, PNG. Maximum 5 MB per file.
                </p>

                <FileInput
                  label="Degree Certificate *"
                  hint="Your engineering degree certificate"
                  file={degreeCert}
                  onFile={setDegreeCert}
                />

                <FileInput
                  label="NYSC Certificate or African Equivalent *"
                  hint="Discharge certificate or equivalent national service documentation"
                  file={nyscCert}
                  onFile={setNyscCert}
                />

                {currentlyEmployed && (
                  <FileInput
                    label="Employment Letter"
                    hint="Current employment verification (optional if not employed)"
                    file={employmentLetter}
                    onFile={setEmploymentLetter}
                  />
                )}
              </div>
            )}

            {/* ── STEP 4: Review ───────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-slate-400 mb-6">
                  Review your application before submitting. Use the Back
                  button to make changes.
                </p>

                <ReviewSection title="Personal Information">
                  <ReviewRow label="Name" value={fullName} />
                  <ReviewRow label="Email" value={email} />
                  <ReviewRow label="Phone" value={phone} />
                  <ReviewRow label="University" value={university} />
                  <ReviewRow label="Discipline" value={discipline} />
                  <ReviewRow label="Graduation Year" value={graduationYear} />
                  <ReviewRow
                    label="Currently Employed"
                    value={currentlyEmployed ? `Yes — ${employer}` : "No"}
                  />
                </ReviewSection>

                <ReviewSection title="Motivation">
                  {MOTIVATION_QUESTIONS.map((q) => (
                    <div key={q.key} className="mb-4">
                      <p className="text-xs text-gold-500 uppercase tracking-wider mb-1">
                        {q.label}
                      </p>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">
                        {motivationState[q.key]}
                      </p>
                    </div>
                  ))}
                </ReviewSection>

                <ReviewSection title="Documents">
                  <ReviewRow
                    label="Degree Certificate"
                    value={degreeCert?.name ?? "—"}
                  />
                  <ReviewRow
                    label="NYSC Certificate"
                    value={nyscCert?.name ?? "—"}
                  />
                  {currentlyEmployed && (
                    <ReviewRow
                      label="Employment Letter"
                      value={employmentLetter?.name ?? "Not provided"}
                    />
                  )}
                </ReviewSection>
              </div>
            )}

            {/* ── Navigation buttons ───────────────────────── */}
            <div className="mt-10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 px-6 py-3 text-sm font-medium transition-colors"
                >
                  <i className="fa-solid fa-arrow-left" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest px-8 py-3 text-sm transition-colors"
                >
                  Continue
                  <i className="fa-solid fa-arrow-right" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest px-8 py-3 text-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */

function FileInput({
  label,
  hint,
  file,
  onFile,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <p className="text-xs text-slate-500 mb-2">{hint}</p>
      <div
        onClick={() => ref.current?.click()}
        className="border border-dashed border-white/10 hover:border-gold-500/30 bg-navy-800 p-6 cursor-pointer transition-colors text-center"
      >
        <input
          ref={ref}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <i className="fa-solid fa-file text-gold-500" />
            <span className="text-sm text-slate-300">{file.name}</span>
            <span className="text-xs text-slate-500">
              ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
              className="text-red-400 hover:text-red-300 text-xs ml-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <i className="fa-solid fa-cloud-arrow-up text-slate-500 text-2xl mb-2 block" />
            <p className="text-sm text-slate-500">
              Click to upload — PDF, JPEG, or PNG (max 5 MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-navy-800 border border-white/5 p-6">
      <h3 className="text-sm font-bold text-gold-500 uppercase tracking-widest mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 w-36 shrink-0 uppercase tracking-wider pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-300">{value}</span>
    </div>
  );
}
