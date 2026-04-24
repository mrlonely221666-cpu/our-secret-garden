-- Tables
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text not null,
  created_at timestamptz not null default now()
);

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text not null,
  created_at timestamptz not null default now()
);

alter table public.photos enable row level security;
alter table public.tracks enable row level security;

-- App is gated by a shared PIN, no auth — allow public access
create policy "Public read photos" on public.photos for select using (true);
create policy "Public insert photos" on public.photos for insert with check (true);
create policy "Public delete photos" on public.photos for delete using (true);

create policy "Public read tracks" on public.tracks for select using (true);
create policy "Public insert tracks" on public.tracks for insert with check (true);
create policy "Public delete tracks" on public.tracks for delete using (true);

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos', 'photos', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','image/heic']),
  ('tracks', 'tracks', true, 52428800, array['audio/mpeg','audio/mp3']);

-- Storage policies (public access, gated by app PIN)
create policy "Public read photo files" on storage.objects for select using (bucket_id = 'photos');
create policy "Public upload photo files" on storage.objects for insert with check (bucket_id = 'photos');
create policy "Public delete photo files" on storage.objects for delete using (bucket_id = 'photos');

create policy "Public read track files" on storage.objects for select using (bucket_id = 'tracks');
create policy "Public upload track files" on storage.objects for insert with check (bucket_id = 'tracks');
create policy "Public delete track files" on storage.objects for delete using (bucket_id = 'tracks');