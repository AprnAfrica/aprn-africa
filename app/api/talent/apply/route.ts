import { NextResponse } from "next/server";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { talentApplicationSchema } from "@/lib/validation";
import { Resend } from "resend";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function validateFile(file: File | null, label: string, required: boolean) {
  if (!file || file.size === 0) {
    if (required) return `${label} is required`;
    return null;
  }
  if (!ALLOWED_TYPES.includes(file.type))
    return `${label} must be PDF, JPEG, or PNG`;
  if (file.size > MAX_FILE_SIZE)
    return `${label} must be under 5 MB`;
  return null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fields = {
      fullName:            formData.get("fullName") as string,
      email:               formData.get("email") as string,
      phone:               formData.get("phone") as string,
      university:          formData.get("university") as string,
      discipline:          formData.get("discipline") as string,
      graduationYear:      formData.get("graduationYear") as string,
      currentlyEmployed:   formData.get("currentlyEmployed") === "true",
      employer:            (formData.get("employer") as string) || undefined,
      whyPipelines:        formData.get("whyPipelines") as string,
      whyPipelinesMatter:  formData.get("whyPipelinesMatter") as string,
      whyAprn:             formData.get("whyAprn") as string,
      contributionToAfrica:formData.get("contributionToAfrica") as string,
    };

    const parsed = talentApplicationSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const degreeCert = formData.get("degreeCert") as File | null;
    const nyscCert   = formData.get("nyscCert") as File | null;
    const employmentLetter = formData.get("employmentLetter") as File | null;

    const fileErrors: string[] = [];
    const degreeErr = validateFile(degreeCert, "Degree certificate", true);
    if (degreeErr) fileErrors.push(degreeErr);
    const nyscErr = validateFile(nyscCert, "NYSC certificate", true);
    if (nyscErr) fileErrors.push(nyscErr);
    const empErr = validateFile(employmentLetter, "Employment letter", false);
    if (empErr) fileErrors.push(empErr);

    if (fileErrors.length > 0) {
      return NextResponse.json({ error: fileErrors.join("; ") }, { status: 400 });
    }

    const supabase = createAdminClient();

    // check for duplicate email
    const { data: existing } = await supabase
      .from("talent_applications")
      .select("id")
      .eq("email", parsed.data.email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists. Contact info@aprn-africa.org if you need to update your submission." },
        { status: 409 }
      );
    }

    // generate application ID for file paths
    const appId = crypto.randomUUID();
    const basePath = `talent-applications/${appId}`;

    async function uploadFile(file: File, name: string): Promise<string> {
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${basePath}/${name}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage
        .from("aprn-documents")
        .upload(path, buf, { contentType: file.type, upsert: false });
      if (error) throw new Error(`Upload failed for ${name}: ${error.message}`);
      return path;
    }

    const degreePath = await uploadFile(degreeCert!, "degree-certificate");
    const nyscPath   = await uploadFile(nyscCert!, "nysc-certificate");
    let empPath: string | null = null;
    if (employmentLetter && employmentLetter.size > 0) {
      empPath = await uploadFile(employmentLetter, "employment-letter");
    }

    const { data, error } = await supabase
      .from("talent_applications")
      .insert({
        id: appId,
        full_name:              parsed.data.fullName,
        email:                  parsed.data.email,
        phone:                  parsed.data.phone,
        university:             parsed.data.university,
        discipline:             parsed.data.discipline,
        graduation_year:        parsed.data.graduationYear,
        degree_class:           "not_specified",
        currently_employed:     parsed.data.currentlyEmployed,
        employer:               parsed.data.employer ?? null,
        degree_cert_path:       degreePath,
        nysc_cert_path:         nyscPath,
        employment_letter_path: empPath,
        why_pipelines:          parsed.data.whyPipelines,
        why_pipelines_matter:   parsed.data.whyPipelinesMatter,
        why_aprn:               parsed.data.whyAprn,
        contribution_to_africa: parsed.data.contributionToAfrica,
        status:                 "submitted",
      })
      .select("id, submitted_at")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      applicationId: data.id,
      submittedAt: data.submitted_at,
    });

    after(async () => {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        console.log("[talent] Resend not configured — skipping emails");
        return;
      }
      const resend = new Resend(resendKey);
      const applicantName = parsed.data.fullName;
      const applicantEmail = parsed.data.email;

      const confirmationPromise = resend.emails.send({
        from: "APRN Africa <newsletter@aprn-africa.org>",
        to: [applicantEmail],
        subject: "Application Received — APRN Pipeline Training Programme",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#071B2A;color:#ffffff;padding:40px;">
            <div style="border-bottom:3px solid #D4A017;padding-bottom:20px;margin-bottom:24px;">
              <h2 style="margin:0;font-size:22px;color:#D4A017;">Application Received</h2>
            </div>
            <p style="font-size:15px;line-height:1.7;">Dear ${applicantName},</p>
            <p style="font-size:15px;line-height:1.7;">Thank you for applying to the APRN Pipeline Training Programme. We have received your application and supporting documents.</p>
            <div style="margin:24px 0;padding:20px;background:#0D2436;border-left:3px solid #D4A017;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Application Reference</p>
              <p style="margin:0;font-size:14px;font-family:monospace;color:#D4A017;">${data.id}</p>
            </div>
            <p style="font-size:15px;line-height:1.7;">Our team will review your submission and contact you at this email address with next steps. Please allow up to two weeks for a response.</p>
            <p style="font-size:15px;line-height:1.7;">If you have any questions, contact us at <a href="mailto:info@aprn-africa.org" style="color:#D4A017;">info@aprn-africa.org</a>.</p>
            <p style="margin-top:32px;font-size:14px;color:#94a3b8;">The African Pipeline Resource Network</p>
          </div>
        `,
      });

      const adminPromise = resend.emails.send({
        from: "APRN Talent Portal <newsletter@aprn-africa.org>",
        to: ["info@aprn-africa.org"],
        subject: `[New Application] ${applicantName} — ${parsed.data.university}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#071B2A;color:#ffffff;padding:40px;">
            <div style="border-bottom:3px solid #D4A017;padding-bottom:20px;margin-bottom:24px;">
              <h2 style="margin:0;font-size:22px;color:#D4A017;">New Talent Application</h2>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:140px;">Name</td><td style="padding:8px 0;font-size:14px;">${applicantName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${applicantEmail}" style="color:#D4A017;">${applicantEmail}</a></td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Phone</td><td style="padding:8px 0;font-size:14px;">${parsed.data.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">University</td><td style="padding:8px 0;font-size:14px;">${parsed.data.university}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Discipline</td><td style="padding:8px 0;font-size:14px;">${parsed.data.discipline}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Graduation</td><td style="padding:8px 0;font-size:14px;">${parsed.data.graduationYear}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Employed</td><td style="padding:8px 0;font-size:14px;">${parsed.data.currentlyEmployed ? `Yes — ${parsed.data.employer ?? ""}` : "No"}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#0D2436;text-align:center;">
              <a href="https://aprn-africa.org/admin/talent" style="color:#D4A017;font-size:14px;font-weight:bold;text-decoration:none;">Review in Admin Panel &rarr;</a>
            </div>
          </div>
        `,
      });

      const results = await Promise.allSettled([confirmationPromise, adminPromise]);
      for (const r of results) {
        if (r.status === "rejected") console.error("[talent] Email send failed:", r.reason);
      }
    });

    return response;
  } catch (err) {
    console.error("Talent application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
