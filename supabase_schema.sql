-- Create the orders table for AirDosa
create table public.orders (
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_name text not null,
    item_name text not null,
    address text not null
);

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Create policy to allow anonymous inserts (necessary if submitting from client-side without auth)
create policy "Allow anonymous inserts"
on public.orders
for insert
to anon
with check (true);

-- Create policy to allow anonymous read access (optional, if you want to display orders)
create policy "Allow anonymous read access"
on public.orders
for select
to anon
using (true);
