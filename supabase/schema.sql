-- ============================================================
-- Nife Finance — Skema Supabase
-- Jalankan seluruh isi file ini di Supabase → SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- Tabel transaksi
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  amount numeric not null check (amount >= 0),
  type text not null check (type in ('income', 'expense')),
  category text not null check (category in ('Makan', 'Transport', 'Kebutuhan', 'Hiburan', 'Gaji')),
  wallet text not null check (wallet in ('Cash', 'Rekening Bank', 'E-Wallet')),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_created_idx
  on public.transactions (user_id, created_at desc);

-- Row Level Security: user hanya bisa mengakses datanya sendiri
alter table public.transactions enable row level security;

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Realtime: siarkan perubahan tabel ini ke klien
-- (abaikan error "already member" jika dijalankan ulang)
alter publication supabase_realtime add table public.transactions;
