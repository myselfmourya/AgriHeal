-- AgriHeal Supabase Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. PROFILES TABLE (Linked to Auth Users)
-- ========================================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  phone_number text unique,
  full_name text,
  language_preference text default 'en-IN',
  location text,
  farm_size text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles: Users can only see and update their own profile
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- ========================================================
-- 2. CROPS TABLE
-- ========================================================
create table public.crops (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  area text,
  planting_date date,
  status text default 'growing',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.crops enable row level security;

-- Policies for crops: Users can only CRUD their own crops
create policy "Users can view own crops." on crops for select using (auth.uid() = user_id);
create policy "Users can insert own crops." on crops for insert with check (auth.uid() = user_id);
create policy "Users can update own crops." on crops for update using (auth.uid() = user_id);
create policy "Users can delete own crops." on crops for delete using (auth.uid() = user_id);

-- ========================================================
-- 3. EXPENSES TABLE
-- ========================================================
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  crop_id uuid references public.crops(id) on delete cascade,
  category text not null,
  amount numeric not null,
  date date not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.expenses enable row level security;

-- Policies for expenses: Users can only CRUD their own expenses
create policy "Users can view own expenses." on expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses." on expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses." on expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses." on expenses for delete using (auth.uid() = user_id);

-- ========================================================
-- 4. TRIGGERS
-- ========================================================
-- Function to automatically create a profile when a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
