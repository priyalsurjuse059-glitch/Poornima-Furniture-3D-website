-- Poornima Furniture schema. Apply with: supabase db push (or run in SQL Editor).
create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'admin');
create type public.product_availability as enum ('available', 'made_to_order', 'unavailable');
create type public.enquiry_status as enum ('new', 'contacted', 'quoted', 'converted', 'closed');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled');
create type public.payment_status as enum ('not_required', 'pending', 'authorized', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  image_url text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 160),
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12,2) check (price is null or price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  price_on_request boolean not null default true,
  images text[] not null default '{}',
  thumbnail_url text,
  materials text[] not null default '{}',
  finishes text[] not null default '{}',
  dimensions jsonb not null default '{}'::jsonb,
  availability public.product_availability not null default 'available',
  customization text,
  featured boolean not null default false,
  published boolean not null default false,
  model_url text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_sale_lte_price check (sale_price is null or price is null or sale_price <= price)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 30),
  email text,
  message text not null check (char_length(message) between 5 and 3000),
  status public.enquiry_status not null default 'new',
  internal_notes text,
  follow_up_at timestamptz,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  phone text not null,
  email text,
  delivery_address text,
  city text,
  pin_code text,
  notes text,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'not_required',
  payment_provider text,
  payment_reference text,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  fulfilment_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  quantity integer not null check (quantity between 1 and 99),
  unit_price numeric(12,2) check (unit_price is null or unit_price >= 0),
  price_on_request boolean not null default false,
  line_total numeric(12,2) check (line_total is null or line_total >= 0),
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  public boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create index products_published_created_idx on public.products(published, created_at desc);
create index products_category_published_idx on public.products(category_id, published);
create index products_featured_idx on public.products(featured) where published = true;
create index product_images_product_order_idx on public.product_images(product_id, display_order);
create index enquiries_status_created_idx on public.enquiries(status, created_at desc);
create index enquiries_follow_up_idx on public.enquiries(follow_up_at) where follow_up_at is not null;
create index orders_status_created_idx on public.orders(status, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index enquiries_assigned_to_idx on public.enquiries(assigned_to);
create index enquiries_product_id_idx on public.enquiries(product_id);
create index order_items_product_id_idx on public.order_items(product_id);
create index site_settings_updated_by_idx on public.site_settings(updated_by);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = pg_catalog.now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger enquiries_updated_at before update on public.enquiries for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

-- New authenticated users always begin as customers. Promote the first owner manually via SQL.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'customer')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin');
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.enquiries enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_settings enable row level security;

create policy "Profile owner or admin can view profiles" on public.profiles for select to authenticated using (id = (select auth.uid()) or private.is_admin());
create policy "Users update their profile name only through allowed row" on public.profiles for update to authenticated using (id = (select auth.uid()) or private.is_admin()) with check (id = (select auth.uid()) or private.is_admin());
-- Role changes are blocked for non-admins via column grants; server/admin SQL is required for promotion.
revoke update (role) on public.profiles from authenticated;
grant update (full_name, updated_at) on public.profiles to authenticated;

create policy "Public sees published categories" on public.categories for select to anon, authenticated using (published = true or private.is_admin());
create policy "Admins manage categories" on public.categories for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public sees published products" on public.products for select to anon, authenticated using (published = true or private.is_admin());
create policy "Admins manage products" on public.products for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public sees images for published products" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and p.published = true) or private.is_admin());
create policy "Admins manage product images" on public.product_images for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public can submit enquiries" on public.enquiries for insert to anon, authenticated with check (status = 'new' and internal_notes is null and assigned_to is null);
create policy "Admins manage enquiries" on public.enquiries for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage orders" on public.orders for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage order items" on public.order_items for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public reads public site settings" on public.site_settings for select to anon, authenticated using (public = true or private.is_admin());
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- Storage buckets. Upload/delete policies are admin-only; product images may be read publicly.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 12582912, array['image/jpeg','image/png','image/webp','image/avif','model/gltf-binary','model/gltf+json'])
on conflict (id) do nothing;
create policy "Public reads product media" on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');
create policy "Admins upload product media" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and private.is_admin());
create policy "Admins update product media" on storage.objects for update to authenticated using (bucket_id = 'product-media' and private.is_admin()) with check (bucket_id = 'product-media' and private.is_admin());
create policy "Admins delete product media" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and private.is_admin());

-- Safe public defaults; contact number/hours intentionally omitted until supplied by the owner.
insert into public.site_settings(key, value, public) values
('brand', '{"name":"Poornima Furniture","display_name":"पूर्णिमा फ़र्नीचर"}'::jsonb, true),
('location', '{"address":"Sutgirni, Hingna Road, Nagpur, Maharashtra, India"}'::jsonb, true),
('contact', '{"phone":null,"whatsapp":null,"hours":null}'::jsonb, true),
('social', '{"instagram":null,"facebook":null}'::jsonb, true),
('homepage', '{"hero_title":"Make room for what matters.","hero_subtitle":"Thoughtful furniture, warm materials, and pieces that feel at home in your home."}'::jsonb, true)
on conflict (key) do nothing;
