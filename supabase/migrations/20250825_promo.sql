create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null,
  label text,
  max_uses int not null default 1,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.promo_codes(id) on delete cascade,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;
alter table public.promo_redemptions enable row level security;

create or replace function public.increment_promo_use(p_code_id uuid)
returns void language plpgsql as $$
begin
  update public.promo_codes
  set used_count = used_count + 1
  where id = p_code_id;
end $$;
