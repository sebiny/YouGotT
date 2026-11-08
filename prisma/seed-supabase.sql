-- Run once in the Supabase SQL Editor after creating the Restaurant, Table,
-- and Party tables. This inserts the demo data from the app's seed data.
begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
set local search_path to extensions, public;

insert into public."Restaurant"
  (id, slug, name, address, "pinHash", "avgTurnMinutes")
values
  ('restaurant-demo-bistro', 'demo-bistro', 'Demo Bistro', '12 Market St', crypt('1234', gen_salt('bf', 10)), 45),
  ('restaurant-sakura-sushi', 'sakura-sushi', 'Sakura Sushi', '88 River Rd', crypt('2345', gen_salt('bf', 10)), 60),
  ('restaurant-taco-town', 'taco-town', 'Taco Town', '5 Sunset Ave', crypt('3456', gen_salt('bf', 10)), 30);

insert into public."Table"
  (id, "restaurantId", label, seats, status, "occupiedSince")
values
  ('demo-bistro-t1', 'restaurant-demo-bistro', 'T1', 2, 'OCCUPIED', now() - interval '30 minutes'),
  ('demo-bistro-t2', 'restaurant-demo-bistro', 'T2', 2, 'OCCUPIED', now() - interval '10 minutes'),
  ('demo-bistro-t3', 'restaurant-demo-bistro', 'T3', 4, 'OCCUPIED', now() - interval '40 minutes'),
  ('demo-bistro-t4', 'restaurant-demo-bistro', 'T4', 4, 'OCCUPIED', now() - interval '5 minutes'),
  ('demo-bistro-t5', 'restaurant-demo-bistro', 'T5', 6, 'OCCUPIED', now() - interval '20 minutes'),
  ('sakura-sushi-bar-1', 'restaurant-sakura-sushi', 'Bar 1', 2, 'FREE', null),
  ('sakura-sushi-bar-2', 'restaurant-sakura-sushi', 'Bar 2', 2, 'OCCUPIED', now() - interval '15 minutes'),
  ('sakura-sushi-booth-a', 'restaurant-sakura-sushi', 'Booth A', 4, 'FREE', null),
  ('sakura-sushi-booth-b', 'restaurant-sakura-sushi', 'Booth B', 6, 'OCCUPIED', now() - interval '25 minutes'),
  ('taco-town-table-1', 'restaurant-taco-town', '1', 4, 'OCCUPIED', now() - interval '20 minutes'),
  ('taco-town-table-2', 'restaurant-taco-town', '2', 4, 'OCCUPIED', now() - interval '8 minutes'),
  ('taco-town-table-3', 'restaurant-taco-town', '3', 8, 'OCCUPIED', now() - interval '15 minutes');

insert into public."Party"
  (id, "restaurantId", name, size, status, token, "joinedAt")
values
  ('demo-bistro-party-alex', 'restaurant-demo-bistro', 'Alex', 2, 'WAITING', 'demo-alex-token-01', now() - interval '12 minutes'),
  ('demo-bistro-party-jordan', 'restaurant-demo-bistro', 'Jordan', 4, 'WAITING', 'demo-jordan-token-01', now() - interval '6 minutes');

commit;
