-- Create the highlights storage bucket (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('highlights', 'highlights', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

-- Authenticated coaches and admins can upload
create policy "highlights storage: auth upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'highlights');

-- Anyone can read (bucket is public)
create policy "highlights storage: public read"
  on storage.objects for select
  using (bucket_id = 'highlights');

-- Uploader or admin can delete
create policy "highlights storage: delete own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'highlights' and (owner = auth.uid() or get_user_role() in ('admin', 'super_admin')));
