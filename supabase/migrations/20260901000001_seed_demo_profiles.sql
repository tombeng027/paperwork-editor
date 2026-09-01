-- Create Alice and Bob in Authentication > Users (or with the Supabase Auth Admin API) first.
-- This safely ensures their matching public profiles exist without handling passwords in SQL.
insert into public.profiles (id, email)
select id, email from auth.users where email in ('alice@test.com', 'bob@test.com')
on conflict (id) do update set email = excluded.email;