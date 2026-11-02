create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  middle_name text,
  full_name text not null default '',
  national_id text not null default '',
  country text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "Admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  status text not null default 'draft' check (status in ('draft','submitted','under_review','accepted','rejected')),
  current_step int not null default 0,
  data jsonb not null default '{}'::jsonb,
  admin_notes text,
  offered_programme text,
  offered_faculty text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.applications(user_id);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;

create policy "Users read own applications" on public.applications for select to authenticated using (user_id = auth.uid());
create policy "Users insert own applications" on public.applications for insert to authenticated with check (user_id = auth.uid() and status = 'draft');
create policy "Users update own unreviewed applications" on public.applications for update to authenticated
  using (user_id = auth.uid() and status in ('draft','submitted'))
  with check (user_id = auth.uid() and status in ('draft','submitted'));
create policy "Users delete own drafts" on public.applications for delete to authenticated using (user_id = auth.uid() and status = 'draft');
create policy "Admins read all applications" on public.applications for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update all applications" on public.applications for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger applications_touch before update on public.applications for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, middle_name, full_name, national_id, country, phone)
  values (
    new.id, coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'middle_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'national_id', ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Storage policies for private 'documents' bucket: files under <user_id>/...
create policy "Users upload own documents" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own documents" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own documents" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Admins read all documents" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'));