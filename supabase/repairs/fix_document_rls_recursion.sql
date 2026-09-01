-- Run this once in the Supabase SQL Editor if the original migration was run earlier.
drop policy if exists "owners and collaborators read documents" on public.documents;
drop policy if exists "owners and collaborators edit documents" on public.documents;
drop policy if exists "owners view sharing" on public.document_access;
drop policy if exists "owners manage sharing" on public.document_access;
drop policy if exists "owners update sharing" on public.document_access;
drop policy if exists "owners revoke sharing" on public.document_access;
drop policy if exists "document members upload attachments" on storage.objects;
drop policy if exists "document members read attachments" on storage.objects;

create or replace function public.can_access_document(target_document_id uuid) returns boolean language sql security definer set search_path = public stable as $$ select exists (select 1 from public.document_access where document_id = target_document_id and user_id = auth.uid()) $$;
create or replace function public.owns_document(target_document_id uuid) returns boolean language sql security definer set search_path = public stable as $$ select exists (select 1 from public.documents where id = target_document_id and owner_id = auth.uid()) $$;

create policy "owners and collaborators read documents" on public.documents for select to authenticated using (owner_id = auth.uid() or public.can_access_document(id));
create policy "owners and collaborators edit documents" on public.documents for update to authenticated using (owner_id = auth.uid() or public.can_access_document(id)) with check (owner_id = auth.uid() or public.can_access_document(id));
create policy "owners view sharing" on public.document_access for select to authenticated using (public.owns_document(document_id));
create policy "owners manage sharing" on public.document_access for insert to authenticated with check (public.owns_document(document_id));
create policy "owners update sharing" on public.document_access for update to authenticated using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "owners revoke sharing" on public.document_access for delete to authenticated using (public.owns_document(document_id));
create policy "document members upload attachments" on storage.objects for insert to authenticated with check (bucket_id = 'document-attachments' and (public.owns_document((storage.foldername(name))[1]::uuid) or public.can_access_document((storage.foldername(name))[1]::uuid)));
create policy "document members read attachments" on storage.objects for select to authenticated using (bucket_id = 'document-attachments' and (public.owns_document((storage.foldername(name))[1]::uuid) or public.can_access_document((storage.foldername(name))[1]::uuid)));