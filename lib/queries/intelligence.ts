import { groq } from 'next-sanity'

export interface TickerItem {
  _id: string
  headline: string
  category: string
  corridorCode?: string
  slug?: string | null
  externalUrl?: string | null
}

export interface HomepageIntelCard {
  _id: string
  headline: string
  summary: string
  category: string
  publishedAt: string
  corridorName?: string
}

export const INTELLIGENCE_TICKER_QUERY = groq`
  *[_type in ["intelligenceUpdate", "editorialInsight"]] | order(coalesce(publishedAt, publishDate) desc)[0...12] {
    _id,
    "headline": coalesce(headline, title),
    "category": coalesce(category, "editorial"),
    "corridorCode": relatedCorridor->code,
    "slug": slug.current,
    externalUrl,
  }
`

export const HOMEPAGE_INTEL_QUERY = groq`
  *[_type == "intelligenceUpdate"] | order(publishedAt desc)[0...4] {
    _id,
    headline,
    summary,
    category,
    publishedAt,
    "corridorName": relatedCorridor->name,
  }
`

// ── Market Intelligence queries ───────────────────────────────────────────────

export interface MarketUpdate {
  _id: string
  headline: string
  summary?: string
  publishedAt: string
  priority: string
  externalUrl?: string | null
  corridorName?: string | null
  slug?: string | null
}

export interface MarketEditorial {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishDate: string
  estimatedReadTime?: number
  heroImage?: string | null
}

export const MARKET_UPDATES_QUERY = groq`
  *[_type == "intelligenceUpdate" && category == "market"] | order(publishedAt desc)[0...12] {
    _id,
    headline,
    summary,
    publishedAt,
    priority,
    externalUrl,
    "corridorName": relatedCorridor->name,
    "slug": slug.current,
  }
`

export const MARKET_EDITORIALS_QUERY = groq`
  *[_type == "editorialInsight" && defined(slug.current)] | order(publishDate desc)[0...6] {
    _id,
    "title": title,
    "slug": slug.current,
    "excerpt": coalesce(excerpt, summary),
    "publishDate": publishDate,
    estimatedReadTime,
    "heroImage": heroImage.asset->url,
  }
`

// ── Policy Tracker queries ─────────────────────────────────────────────────────

export interface PolicyUpdate {
  _id: string
  headline: string
  summary?: string
  publishedAt: string
  priority: string
  externalUrl?: string | null
  corridorName?: string | null
  slug?: string | null
}

export interface PolicyEditorial {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishDate: string
  estimatedReadTime?: number
  heroImage?: string | null
}

export interface PolicyFramework {
  _id: string
  title: string
  slug: string
  frameworkType: string
  summary: string
  dateAdopted?: string | null
  inForce: boolean
  countriesCount: number
}

export const POLICY_UPDATES_QUERY = groq`
  *[_type == "intelligenceUpdate" && category == "policy"] | order(publishedAt desc)[0...12] {
    _id,
    headline,
    summary,
    publishedAt,
    priority,
    externalUrl,
    "corridorName": relatedCorridor->name,
    "slug": slug.current,
  }
`

export const POLICY_FRAMEWORKS_QUERY = groq`
  *[_type == "policyFramework"] | order(coalesce(dateAdopted, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    frameworkType,
    summary,
    dateAdopted,
    inForce,
    "countriesCount": count(countries),
  }
`

export const POLICY_EDITORIALS_QUERY = groq`
  *[_type == "editorialInsight" && defined(slug.current)] | order(publishDate desc)[0...8] {
    _id,
    "title": title,
    "slug": slug.current,
    "excerpt": coalesce(excerpt, summary),
    "publishDate": publishDate,
    estimatedReadTime,
    "heroImage": heroImage.asset->url,
  }
`

export interface HomepageLatestCard {
  _id: string
  title: string
  slug: string | null
  excerpt: string
  publishDate: string
  category: string
  heroImage: string | null
  readTime: number | null
}

export const HOMEPAGE_LATEST_QUERY = groq`
  *[_type in ["editorialInsight", "intelligenceUpdate"]] | order(coalesce(publishDate, publishedAt) desc)[0...4] {
    _id,
    "title": coalesce(title, headline),
    "slug": slug.current,
    "excerpt": coalesce(excerpt, summary),
    "publishDate": coalesce(publishDate, publishedAt),
    "category": coalesce(
      select(_type == "editorialInsight" => "Editorial"),
      select(category == "market"       => "Market"),
      select(category == "project"      => "Project"),
      select(category == "policy"       => "Policy"),
      select(category == "training"     => "Training"),
      select(category == "partnership"  => "Partnership"),
      "Intelligence"
    ),
    "heroImage": heroImage.asset->url,
    "readTime": estimatedReadTime,
  }
`
