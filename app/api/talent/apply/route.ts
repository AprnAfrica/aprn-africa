import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { talentApplicationSchema } from "@/lib/validation";

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
        degree_class:           "first_class",
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

    return NextResponse.json({
      success: true,
      applicationId: data.id,
      submittedAt: data.submitted_at,
    });
  } catch (err) {
    console.error("Talent application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
