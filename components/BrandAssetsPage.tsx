"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";

interface Variant {
  label: string;
  src: string;
  bg: string;
  bgLabel: string;
  width: number;
  height: number;
  filename: string;
  padding: number;
}

const FULL_LOGO_VARIANTS: Variant[] = [
  { label: "Full Logo", src: "/images/logo.png", bg: "#071B2A", bgLabel: "Navy-900", width: 1200, height: 630, filename: "aprn-logo-navy", padding: 80 },
  { label: "Full Logo", src: "/images/logo.png", bg: "#FFFFFF", bgLabel: "White", width: 1200, height: 630, filename: "aprn-logo-white", padding: 80 },
  { label: "Full Logo", src: "/images/logo.png", bg: "#0D2436", bgLabel: "Navy-800", width: 1200, height: 630, filename: "aprn-logo-navy800", padding: 80 },
];

const ICON_VARIANTS: Variant[] = [
  { label: "Icon Mark", src: "/images/logo-icon.png", bg: "#071B2A", bgLabel: "Navy-900", width: 512, height: 512, filename: "aprn-icon-navy", padding: 64 },
  { label: "Icon Mark", src: "/images/logo-icon.png", bg: "#FFFFFF", bgLabel: "White", width: 512, height: 512, filename: "aprn-icon-white", padding: 64 },
  { label: "Icon Mark", src: "/images/logo-icon.png", bg: "#D4A017", bgLabel: "Gold-500", width: 512, height: 512, filename: "aprn-icon-gold", padding: 64 },
];

const EMAIL_VARIANTS: Variant[] = [
  { label: "Email Signature", src: "/images/logo.png", bg: "#071B2A", bgLabel: "Navy-900", width: 400, height: 120, filename: "aprn-email-navy", padding: 20 },
  { label: "Email Signature", src: "/images/logo.png", bg: "#FFFFFF", bgLabel: "White", width: 400, height: 120, filename: "aprn-email-white", padding: 20 },
];

const SOCIAL_VARIANTS: Variant[] = [
  { label: "Social / OG Image", src: "/images/logo.png", bg: "#071B2A", bgLabel: "Navy-900", width: 1200, height: 630, filename: "aprn-social-navy", padding: 120 },
  { label: "Profile Picture", src: "/images/logo-icon.png", bg: "#071B2A", bgLabel: "Navy-900", width: 400, height: 400, filename: "aprn-profile-navy", padding: 48 },
  { label: "Profile Picture", src: "/images/logo-icon.png", bg: "#FFFFFF", bgLabel: "White", width: 400, height: 400, filename: "aprn-profile-white", padding: 48 },
];

function DownloadCard({ variant }: { variant: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const download = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = variant.width;
    canvas.height = variant.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = variant.bg;
    ctx.fillRect(0, 0, variant.width, variant.height);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const pad = variant.padding;
      const availW = variant.width - pad * 2;
      const availH = variant.height - pad * 2;
      const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const x = (variant.width - drawW) / 2;
      const y = (variant.height - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${variant.filename}-${variant.width}x${variant.height}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = variant.src;
  }, [variant]);

  const isWide = variant.width / variant.height > 1.5;

  return (
    <div className="border border-white/5 bg-navy-800 group hover:border-gold-500/20 transition-colors">
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: variant.bg,
          aspectRatio: isWide ? "16/9" : "1/1",
          padding: `${Math.round(variant.padding / 4)}px`,
        }}
      >
        <Image
          src={variant.src}
          alt={variant.label}
          width={variant.width}
          height={variant.height}
          className="object-contain max-h-full max-w-full"
          unoptimized
        />
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{variant.label}</p>
          <p className="text-xs text-slate-500">
            {variant.bgLabel} &middot; {variant.width}&times;{variant.height}px
          </p>
        </div>
        <button
          onClick={download}
          className="shrink-0 px-4 py-2 bg-gold-500 text-navy-900 text-[10px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
        >
          <i className="fa-solid fa-download mr-1.5" />
          PNG
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function ColorSwatch({ hex, name }: { hex: string; name: string }) {
  const copy = useCallback(() => {
    navigator.clipboard.writeText(hex);
  }, [hex]);

  return (
    <button onClick={copy} className="group/swatch text-left border border-white/5 hover:border-gold-500/20 transition-colors">
      <div className="h-20" style={{ backgroundColor: hex }} />
      <div className="p-3 bg-navy-800">
        <p className="text-xs font-semibold text-white">{name}</p>
        <p className="text-[10px] text-slate-500 font-mono group-hover/swatch:text-gold-500 transition-colors">{hex} — click to copy</p>
      </div>
    </button>
  );
}

export default function BrandAssetsPage() {
  return (
    <main className="bg-navy-900 text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-360 mx-auto">
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">Brand Assets</span>
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Visual Identity<br />
          <span className="text-gold-500">Kit</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
          Official logo files, brand colours, and usage guidelines for the African Pipeline Resource Network. Download assets for presentations, social media, email signatures, and print.
        </p>
      </section>

      {/* Full Logo */}
      <section className="py-16 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">01</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Full Logo
        </h2>
        <p className="text-sm text-slate-400 mb-10 max-w-lg">
          The primary APRN logo — Africa pipeline mark with wordmark and tagline. Use this as the default across all materials.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FULL_LOGO_VARIANTS.map((v) => (
            <DownloadCard key={v.filename} variant={v} />
          ))}
        </div>
      </section>

      {/* Icon Mark */}
      <section className="py-16 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">02</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Icon Mark
        </h2>
        <p className="text-sm text-slate-400 mb-10 max-w-lg">
          The Africa pipeline network mark. Use for favicons, app icons, profile pictures, and contexts where the full logo doesn't fit.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ICON_VARIANTS.map((v) => (
            <DownloadCard key={v.filename} variant={v} />
          ))}
        </div>
      </section>

      {/* Social & Email */}
      <section className="py-16 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">03</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Social &amp; Email
        </h2>
        <p className="text-sm text-slate-400 mb-10 max-w-lg">
          Pre-sized assets for LinkedIn, Open Graph cards, profile pictures, and email signatures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SOCIAL_VARIANTS.map((v) => (
            <DownloadCard key={v.filename} variant={v} />
          ))}
        </div>
        <h3 className="text-sm font-semibold text-white mb-4">Email Signature</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {EMAIL_VARIANTS.map((v) => (
            <DownloadCard key={v.filename} variant={v} />
          ))}
        </div>
      </section>

      {/* Brand Colours */}
      <section className="py-16 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">04</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Brand Colours
        </h2>
        <p className="text-sm text-slate-400 mb-10 max-w-lg">
          Click any swatch to copy its hex value.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          <ColorSwatch hex="#071B2A" name="Navy-900" />
          <ColorSwatch hex="#0D2436" name="Navy-800" />
          <ColorSwatch hex="#15324A" name="Navy-700" />
          <ColorSwatch hex="#D4A017" name="Gold-500" />
          <ColorSwatch hex="#E5B83B" name="Gold-400" />
          <ColorSwatch hex="#C97A2B" name="Copper-500" />
          <ColorSwatch hex="#FFFFFF" name="White" />
        </div>
        <div className="mt-8 h-2 w-full" style={{ background: "linear-gradient(to right, #D4A017, #C97A2B)" }} />
        <p className="text-xs text-slate-500 mt-3">Brand gradient — Gold-500 to Copper-500, left to right. Used for accent bars and decorative elements.</p>
      </section>

      {/* Usage Rules */}
      <section className="py-16 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">05</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-10"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Usage Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-2 border-emerald-500/50 bg-navy-800 p-6 border border-white/5" style={{ borderLeftColor: "rgba(93,212,168,0.5)" }}>
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-4">Always</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span> Use the full logo on navy or white backgrounds</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span> Maintain clear space equal to the height of the "A" on all sides</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span> Use official assets from this page — never recreate the logo</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span> Keep sharp rectangular edges — no rounded corners</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span> Use only the brand colours listed above</li>
            </ul>
          </div>
          <div className="border-l-2 border-red-500/50 bg-navy-800 p-6 border border-white/5" style={{ borderLeftColor: "rgba(244,112,112,0.5)" }}>
            <p className="text-xs font-bold tracking-widest uppercase text-red-400 mb-4">Never</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#10007;</span> Place the logo on patterned or photographic backgrounds</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#10007;</span> Stretch, rotate, skew, or distort the logo</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#10007;</span> Change the gold or navy to any other colour</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#10007;</span> Add drop shadows, gradients, or rounded corners</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#10007;</span> Use low-resolution or unofficial logo files</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-12 px-6 md:px-12 max-w-360 mx-auto border-t border-white/5">
        <p className="text-xs text-slate-500 text-center">
          APRN Brand Guidelines v2 &middot; 2026 &middot; For questions, contact <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">info@aprn-africa.org</a>
        </p>
      </section>
    </main>
  );
}
