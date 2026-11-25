import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pipeline Talent Initiative — APRN Africa",
  description:
    "APRN is accepting applications from First Class engineering graduates (2021–2026) for specialised pipeline industry training in partnership with EITEP. Apply now.",
  openGraph: {
    title: "APRN Pipeline Talent Initiative",
    description:
      "First Class engineering graduates from African universities — apply for APRN's fully funded pipeline engineering training programme starting 2027.",
    type: "website",
    url: "https://aprn-africa.org/talent",
    images: [
      {
        url: "/images/female-engineer-training.png",
        width: 1200,
        height: 630,
        alt: "APRN Pipeline Talent Initiative",
      },
    ],
  },
};

const ELIGIBILITY = [
  {
    icon: "fa-graduation-cap",
    label: "First Class Degree",
    desc: "In any engineering discipline from an accredited African university",
  },
  {
    icon: "fa-calendar-check",
    label: "Graduated 2021–2026",
    desc: "Fresh graduates or engineers with up to five years of industry experience",
  },
  {
    icon: "fa-earth-africa",
    label: "African University",
    desc: "Must have graduated from a recognised university on the African continent",
  },
  {
    icon: "fa-route",
    label: "Pipeline Career Interest",
    desc: "Genuine commitment to pursuing a career in Africa's pipeline infrastructure sector",
  },
];

const CURRICULUM = [
  {
    day: 1,
    title: "Pipeline Infrastructure & Inspection Fundamentals",
    topics: [
      "Aging pipeline infrastructure management",
      "Regulations, technologies, and real-world case studies",
      "History of pipeline inspection — defects, materials, and media transport",
    ],
  },
  {
    day: 2,
    title: "Inspection Technologies",
    topics: [
      "Magnetic flux leakage testing — capabilities and limitations",
      "Ultrasonic technology — wall thickness and crack inspection",
      "Inspection tools: cleaning pigs, caliper pigs, intelligent pigs, and robots",
    ],
  },
  {
    day: 3,
    title: "Inspection Operations",
    topics: [
      "Planning and executing an inspection run",
      "Pig traps, pigability assessment, and procedure",
      "Operator perspective: pig concepts, bidder selection, operational experience",
    ],
  },
  {
    day: 4,
    title: "Data Analysis & Reporting",
    topics: [
      "Analysis methods and reporting from the service provider view",
      "Report specifications and liaison with operators",
      "PIMS for operations, management, and legal compliance",
    ],
  },
  {
    day: 5,
    title: "Evaluation & Conclusions",
    topics: [
      "Probability of failure and repair specifications",
      "Comparison of inspection runs and corrosion growth analysis",
      "Programme conclusion and certification",
    ],
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Review Eligibility",
    desc: "Confirm you meet the academic and graduation year requirements before starting your application.",
  },
  {
    num: "02",
    title: "Complete Application",
    desc: "Provide your details, engineering background, and answer four motivation questions about your interest in pipelines and APRN's mission.",
  },
  {
    num: "03",
    title: "Upload Documents",
    desc: "Submit your degree certificate, NYSC certificate, and employment letter (if currently employed).",
  },
  {
    num: "04",
    title: "Selection Review",
    desc: "APRN reviews all applications. Registration does not guarantee selection — candidates are evaluated on merit and demonstrated commitment.",
  },
];

export default function TalentPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center bg-navy-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/female-engineer-training.png"
              alt=""
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/95 to-navy-900/60" />
          </div>

          <div className="relative z-10 mx-auto max-w-360 px-4 py-32 sm:px-8">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-6">
              Applications Now Open
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-240"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Pipeline Talent
              <br />
              <span className="text-gold-500">Initiative</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-160 leading-relaxed">
              APRN is building Africa&apos;s next generation of pipeline
              engineering professionals. We are selecting First Class
              engineering graduates from across the continent for specialised
              industry training delivered in partnership with EITEP.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/talent/apply"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest px-8 py-4 text-sm transition-colors"
              >
                <i className="fa-solid fa-paper-plane" />
                Apply Now
              </Link>
              <a
                href="#eligibility"
                className="inline-flex items-center justify-center gap-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold uppercase tracking-widest px-8 py-4 text-sm transition-colors"
              >
                Check Eligibility
              </a>
            </div>

            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
              {[
                { value: "First Class", label: "Required Degree" },
                { value: "2021–2026", label: "Graduation Years" },
                { value: "5 Days", label: "Intensive Training" },
                { value: "Jan 2027", label: "Programme Start" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-2xl sm:text-3xl font-bold text-gold-500"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why This Programme ─────────────────────────────── */}
        <section className="bg-navy-900 py-24 border-t border-white/5">
          <div className="mx-auto max-w-360 px-4 sm:px-8">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-4">
              The Vision
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white max-w-200"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Why Africa Needs Pipeline Talent Now
            </h2>
            <div className="mt-10 grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "fa-oil-well",
                  title: "Africa's Pipeline Moment",
                  text: "Billions of dollars in pipeline infrastructure are planned or under construction across the continent. The industry needs trained African engineers — not imported expertise.",
                },
                {
                  icon: "fa-bolt",
                  title: "Energy Security",
                  text: "Pipeline infrastructure is the backbone of energy distribution. Africa's energy independence depends on building domestic engineering capacity in design, inspection, and integrity management.",
                },
                {
                  icon: "fa-users-gear",
                  title: "APRN's Role",
                  text: "APRN anchors pipeline talent within Africa. Through partnerships with EITEP and industry leaders, we provide internationally certified training that positions African engineers for global-standard careers.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-navy-800 border border-white/5 p-8 hover:border-gold-500/20 transition-colors"
                >
                  <i
                    className={`fa-solid ${card.icon} text-gold-500 text-2xl mb-5 block`}
                  />
                  <h3 className="text-lg font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Eligibility ────────────────────────────────────── */}
        <section
          id="eligibility"
          className="bg-navy-900 py-24 border-t border-white/5"
        >
          <div className="mx-auto max-w-360 px-4 sm:px-8">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-4">
              Requirements
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Who Can Apply
            </h2>
            <p className="mt-4 text-slate-400 max-w-180">
              This programme is deliberately selective. We are looking for
              exceptional graduates with demonstrated academic excellence and a
              genuine commitment to the pipeline industry.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ELIGIBILITY.map((item) => (
                <div
                  key={item.label}
                  className="bg-navy-800 border border-white/5 p-6 hover:border-gold-500/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-gold-500/10 flex items-center justify-center mb-5">
                    <i
                      className={`fa-solid ${item.icon} text-gold-500 text-lg`}
                    />
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.label}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-navy-800 border border-gold-500/20 p-8">
              <h3 className="text-white font-bold mb-4 flex items-center gap-3">
                <i className="fa-solid fa-file-arrow-up text-gold-500" />
                Documents You Will Need
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-gold-500 mt-0.5 shrink-0" />
                  Degree certificate (PDF, JPEG, or PNG — max 5 MB)
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-gold-500 mt-0.5 shrink-0" />
                  NYSC discharge or exemption certificate
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-gold-500 mt-0.5 shrink-0" />
                  Employment letter (if currently employed)
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-info-circle text-slate-500 mt-0.5 shrink-0" />
                  Have your motivation answers ready — four questions, minimum 50 characters each
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Curriculum ─────────────────────────────────────── */}
        <section className="bg-navy-900 py-24 border-t border-white/5">
          <div className="mx-auto max-w-360 px-4 sm:px-8">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-4">
              Training Programme
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              5-Day Curriculum Overview
            </h2>
            <p className="mt-4 text-slate-400 max-w-180">
              Pipeline Inspection &amp; Integrity Management — delivered in
              partnership with EITEP. Half-day intensive sessions (9:00 am –
              1:00 pm).
            </p>

            <div className="mt-12 space-y-4">
              {CURRICULUM.map((day) => (
                <div
                  key={day.day}
                  className="bg-navy-800 border border-white/5 hover:border-gold-500/20 transition-colors"
                >
                  <div className="flex items-stretch">
                    <div className="bg-gold-500 text-navy-900 font-bold text-sm uppercase tracking-widest flex items-center justify-center px-6 shrink-0 min-w-20">
                      Day {day.day}
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-white font-bold mb-3">
                        {day.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {day.topics.map((t) => (
                          <li
                            key={t}
                            className="text-sm text-slate-400 flex items-start gap-2"
                          >
                            <i className="fa-solid fa-angle-right text-gold-500/60 mt-0.5 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-slate-500 flex items-center gap-2">
              <i className="fa-solid fa-award text-gold-500/40" />
              Curriculum delivered by EITEP — www.eitep-training.com
            </p>
          </div>
        </section>

        {/* ── Application Process ────────────────────────────── */}
        <section className="bg-navy-900 py-24 border-t border-white/5">
          <div className="mx-auto max-w-360 px-4 sm:px-8">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-4">
              How To Apply
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Application Process
            </h2>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="relative">
                  <span
                    className="text-6xl font-bold text-gold-500/10 absolute -top-4 -left-1"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {step.num}
                  </span>
                  <div className="pt-10">
                    <h3 className="text-white font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/talent/apply"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest px-10 py-4 text-sm transition-colors"
              >
                <i className="fa-solid fa-paper-plane" />
                Start Your Application
              </Link>
              <p className="mt-4 text-sm text-slate-500">
                Questions? Contact{" "}
                <a
                  href="mailto:info@aprn-africa.org"
                  className="text-gold-500 hover:underline"
                >
                  info@aprn-africa.org
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
