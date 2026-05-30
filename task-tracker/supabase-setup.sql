-- 1. Создайте таблицу profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null check (role in ('client', 'developer')),
  full_name text,
  created_at timestamptz default now()
);

-- 2. Создайте таблицу tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'review', 'done')),
  deadline date,
  created_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Включите Row Level Security
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- 4. Политики для profiles
create policy "Пользователь видит свой профиль"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Разработчик видит все профили"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'developer'
    )
  );

-- 5. Политики для tasks
create policy "Клиент видит свои задачи"
  on public.tasks for select
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'developer'
    )
  );

create policy "Все могут создавать задачи"
  on public.tasks for insert
  with check (auth.uid() is not null);

create policy "Все могут редактировать задачи (RLS через API)"
  on public.tasks for update
  using (auth.uid() is not null);

create policy "Только разработчик может удалять"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'developer'
    )
  );

-- 6. Функция для автосоздания профиля при регистрации (опционально)
-- Вместо этого вставляйте профиль вручную после создания пользователя через Dashboard
