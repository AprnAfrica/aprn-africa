import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BrandAssetsPage from "@/components/BrandAssetsPage";
import { sanityFetch } from "@/lib/sanity/fetch";
import { SITE_SETTINGS_FOOTER_QUERY, type SiteSettingsFooter } from "@/lib/queries/siteSettings";

export const metadata: Metadata = {
  title: "Brand Assets — APRN Africa",
  description:
    "Official logo files, brand colours, and visual identity guidelines for the African Pipeline Resource Network. Download assets for presentations, social media, email, and print.",
};

export default async function BrandPage() {
  let siteSettings: SiteSettingsFooter | null = null;
  try {
    siteSettings = await sanityFetch<SiteSettingsFooter>(SITE_SETTINGS_FOOTER_QUERY, {}, ["site"]);
  } catch {}

  return (
    <>
      <Navigation />
      <BrandAssetsPage />
      <Footer siteSettings={siteSettings} />
    </>
  );
}
