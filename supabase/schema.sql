create table if not exists public.site_data (
  id text primary key default 'main',
  products jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  leads jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_data (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_data enable row level security;

drop policy if exists "Public can read site data" on public.site_data;
create policy "Public can read site data"
on public.site_data for select
to anon, authenticated
using (id = 'main');

drop policy if exists "Public can update site data" on public.site_data;
create policy "Public can update site data"
on public.site_data for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', true)
on conflict (id) do update set public = true;

create table if not exists public.prescription_uploads (
  id text primary key,
  product_id text not null,
  product_name text not null,
  file_name text not null,
  file_type text not null default '',
  file_size bigint not null default 0,
  file_url text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table public.prescription_uploads enable row level security;

drop policy if exists "Public can view prescription uploads" on public.prescription_uploads;
create policy "Public can view prescription uploads"
on public.prescription_uploads for select
to anon, authenticated
using (true);

drop policy if exists "Public can create prescription uploads" on public.prescription_uploads;
create policy "Public can create prescription uploads"
on public.prescription_uploads for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can view prescription files" on storage.objects;
create policy "Public can view prescription files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'prescriptions');

drop policy if exists "Public can upload prescription files" on storage.objects;
create policy "Public can upload prescription files"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'prescriptions');

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "Public can upload site images" on storage.objects;
create policy "Public can upload site images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'site-images');