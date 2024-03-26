-- migrate:up
alter table novista.poi
    add constraint number_uniq unique (number),
    alter column number drop not null,
    add if not exists facebook varchar;

alter table novista.hotspot
    drop constraint if exists panorama_poi_uniq,
    add constraint panorama_poi_uniq unique (panorama_id, poi_id);

-- migrate:down
alter table novista.poi
    drop constraint number_uniq,
    drop if exists facebook;

alter table novista.hotspot
    drop constraint if exists panorama_poi_uniq;