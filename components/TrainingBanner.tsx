import Link from "next/link";
import Image from "next/image";

export default function TrainingBanner() {
  return (
    <section className="relative bg-navy-900 border-t border-b border-gold-500/20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/pipeline-training-banner.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/90 to-navy-900/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-360 px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">
            Applications Now Open
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Pipeline Training Programme
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-140 leading-relaxed">
            Building Africa&apos;s next generation of pipeline professionals.
            Practical, industry-relevant training in pipeline design, operations,
            integrity and safety — delivered in partnership with EITEP.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
          <Link
            href="/talent/apply"
            className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest px-8 py-3.5 text-sm transition-colors whitespace-nowrap"
          >
            <i className="fa-solid fa-paper-plane" />
            Apply Now
          </Link>
          <Link
            href="/talent"
            className="inline-flex items-center justify-center gap-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-medium uppercase tracking-widest px-8 py-3.5 text-sm transition-colors whitespace-nowrap"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
