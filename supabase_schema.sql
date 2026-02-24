-- Run this script in your Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  description text,
  price numeric default 0,
  cost numeric default 0,
  min_stock integer default 0,
  status text default 'ATIVO',
  image text,
  created_at timestamp with time zone default now()
);

-- 2. Variants Table (Linked to Products)
create table public.variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  size text not null,
  color text,
  stock integer default 0,
  sku text,
  model text,
  created_at timestamp with time zone default now()
);

-- 3. Stock Movements Table
create table public.stock_movements (
  id uuid default uuid_generate_v4() primary key,
  date timestamp with time zone default now(),
  type text not null, -- 'ENTRADA' or 'SAIDA'
  reason text,
  product_id uuid references public.products(id),
  variant_id uuid references public.variants(id),
  quantity integer not null,
  user_id text,
  client_name text,
  model text,
  category text,
  product_name text,
  size text,
  color text,
  created_at timestamp with time zone default now()
);

-- 4. Clients Table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  type text, -- 'ALUNO', 'PROFESSOR', etc.
  created_at timestamp with time zone default now()
);

-- 5. Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id),
  client_name text,
  date timestamp with time zone default now(),
  status text default 'PENDENTE',
  total numeric default 0,
  payment_method text,
  items jsonb, -- Storing items as JSON for simplicity
  created_at timestamp with time zone default now()
);

-- 6. Expenses Table
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  description text not null,
  amount numeric not null,
  category text,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) - Optional for now, but good practice
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.stock_movements enable row level security;
alter table public.clients enable row level security;
alter table public.orders enable row level security;
alter table public.expenses enable row level security;

-- Create policies to allow public access (for simplicity in this demo)
-- IN PRODUCTION, YOU SHOULD RESTRICT THIS!
create policy "Allow public access" on public.products for all using (true);
create policy "Allow public access" on public.variants for all using (true);
create policy "Allow public access" on public.stock_movements for all using (true);
create policy "Allow public access" on public.clients for all using (true);
create policy "Allow public access" on public.orders for all using (true);
create policy "Allow public access" on public.expenses for all using (true);
