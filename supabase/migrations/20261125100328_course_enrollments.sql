create table public.course_enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  program_slug text not null,
  status       text not null default 'enrolled' check (status in ('enrolled', 'completed', 'dropped')),
  enrolled_at  timestamptz not null default now(),
  unique (user_id, program_slug)
);

alter table public.course_enrollments enable row level security;

create policy "Users read own enrollments"
  on public.course_enrollments for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users enroll themselves"
  on public.course_enrollments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own enrollments"
  on public.course_enrollments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
