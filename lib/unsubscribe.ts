import { createHmac } from "crypto";

const SECRET_KEY = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? process.env.SANITY_WRITE_TOKEN ?? "aprn-fallback-key";

export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", SECRET_KEY).update(email.toLowerCase().trim()).digest("hex").slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  return generateUnsubscribeToken(email) === token;
}

export function buildUnsubscribeUrl(email: string, siteUrl: string): string {
  const token = generateUnsubscribeToken(email);
  return `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
