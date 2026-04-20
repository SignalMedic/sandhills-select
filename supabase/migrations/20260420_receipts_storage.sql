-- Receipts storage bucket (public — URLs are UUID-based and not guessable)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('receipts', 'receipts', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic','application/pdf'])
on conflict (id) do nothing;

-- Authenticated coaches and admins can upload
create policy "receipts storage: auth upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'receipts');

-- Public read (bucket is public, path is UUID-based)
create policy "receipts storage: public read"
  on storage.objects for select
  using (bucket_id = 'receipts');

-- Uploader or admin can delete
create policy "receipts storage: delete own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'receipts' and (owner = auth.uid() or get_user_role() in ('admin', 'super_admin')));
