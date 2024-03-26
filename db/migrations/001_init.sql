-- migrate:up
create schema if not exists novista;

create table if not exists novista.tour
(
    created_at       timestamptz  not null default now(),
    id               serial primary key,
    name             varchar(100) not null,
    main_panorama_id integer
);

create table if not exists novista.panorama
(
    created_at    timestamptz  not null default now(),
    id            serial primary key,
    tour_id       integer references novista.tour,
    panorama_file varchar(300) not null
);

create table if not exists novista.poi
(
    created_at timestamptz  not null default now(),
    id         serial primary key,
    type       varchar(30),
    constraint validate_type check (type in ('info', 'tour')),
    name       varchar(100) not null,
    number     integer      not null,
    site       varchar
);

create table if not exists novista.hotspot
(
    created_at  timestamptz not null default now(),
    id          serial primary key,
    panorama_id integer references novista.panorama (id),
    poi_id      integer references novista.poi (id),
    pitch       real,
    yaw         real
);

-- migrate:down
drop table if exists novista.hotspot;
drop table if exists novista.panorama;
drop table if exists novista.poi;
drop table if exists novista.tour;
drop schema if exists novista;
