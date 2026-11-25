import { z } from "zod";

// ─── Onboarding ────────────────────────────────────────────────────

export const onboardingSchema = z.object({
  fullName:   z.string().min(2, "Full name must be at least 2 characters").max(80),
  discipline: z.string().optional(),
  org:        z.string().max(100).optional(),
  country:    z.string().max(60).optional(),
  topics:     z.array(z.string()).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ─── Password change ───────────────────────────────────────────────

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordInput = z.infer<typeof passwordSchema>;

// ─── Profile settings ──────────────────────────────────────────────

export const profileSettingsSchema = z.object({
  full_name:    z.string().min(2, "Name must be at least 2 characters").max(80).or(z.literal("")),
  job_title:    z.string().max(100).optional(),
  organisation: z.string().max(100).optional(),
  country:      z.string().max(60).optional(),
  linkedin_url: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .or(z.literal(""))
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;

// ─── Talent application ───────────────────────────────────────────

export const talentApplicationSchema = z.object({
  fullName:            z.string().min(2, "Full name is required").max(100),
  email:               z.string().email("Enter a valid email address"),
  phone:               z.string().min(7, "Enter a valid phone number").max(20),
  university:          z.string().min(2, "University name is required").max(200),
  discipline:          z.string().min(2, "Engineering discipline is required").max(100),
  graduationYear:      z.coerce.number().int().min(2021).max(2026),
  currentlyEmployed:   z.boolean(),
  employer:            z.string().max(200).optional(),
  whyPipelines:        z.string().min(50, "Minimum 50 characters").max(2000),
  whyPipelinesMatter:  z.string().min(50, "Minimum 50 characters").max(2000),
  whyAprn:             z.string().min(50, "Minimum 50 characters").max(2000),
  contributionToAfrica:z.string().min(50, "Minimum 50 characters").max(2000),
});

export type TalentApplicationInput = z.infer<typeof talentApplicationSchema>;
