-- Talent applications for the APRN Pipeline Talent Initiative
create table if not exists talent_applications (
  id                     uuid primary key default gen_random_uuid(),
  full_name              text not null,
  email                  text not null,
  phone                  text not null,
  university             text not null,
  discipline             text not null,
  graduation_year        int  not null check (graduation_year between 2021 and 2026),
  degree_class           text not null default 'first_class',
  currently_employed     boolean not null default false,
  employer               text,

  -- document paths in aprn-documents bucket
  degree_cert_path       text not null,
  nysc_cert_path         text not null,
  employment_letter_path text,

  -- motivation answers
  why_pipelines          text not null,
  why_pipelines_matter   text not null,
  why_aprn               text not null,
  contribution_to_africa text not null,

  -- process
  status                 text not null default 'submitted'
                         check (status in ('submitted','under_review','shortlisted','accepted','rejected')),
  reviewer_notes         text,
  reviewed_by            text,
  submitted_at           timestamptz not null default now(),
  reviewed_at            timestamptz
);

-- RLS: only service role (admin client) can read/write
alter table talent_applications enable row level security;

-- index for admin queries
create index idx_talent_applications_status on talent_applications (status);
create index idx_talent_applications_submitted on talent_applications (submitted_at desc);
