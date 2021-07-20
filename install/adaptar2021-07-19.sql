set role to identidad_owner;
set search_path = identidad, public;


create table "variantes" (
  "nota" bigint, 
  "lote" bigint, 
  "orden" bigint, 
  "observaciones" text, 
  "fecha" date, 
  "destinatario" text, 
  "domicilio" text, 
  "domicilio2" text, 
  "codpos" text, 
  "idv" text default substr(random()::text,3), 
  "alternativa" text
, primary key ("nota", "lote", "orden")
);
grant select, insert, update, delete on "variantes" to identidad_admin;
grant all on "variantes" to identidad_owner;



-- conss
alter table "variantes" add constraint "observaciones<>''" check ("observaciones"<>'');
alter table "variantes" add constraint "domicilio<>''" check ("domicilio"<>'');
alter table "variantes" add constraint "domicilio2<>''" check ("domicilio2"<>'');
alter table "variantes" add constraint "codpos<>''" check ("codpos"<>'');
alter table "variantes" add constraint "idv<>''" check ("idv"<>'');
alter table "variantes" add constraint "alternativa<>''" check ("alternativa"<>'');
-- FKs
alter table "variantes" add constraint "variantes notas REL" foreign key ("nota") references "notas" ("nota")  on update cascade;
-- index
create index "nota 4 variantes IDX" ON "variantes" ("nota");
-- policies

insert into variantes (nota, lote, orden, fecha, idv)
  select nota, 1, 1, desde, idnota
    from notas;

alter table notas drop column idnota;
alter table notas drop column desde;
alter table notas drop column hasta;

alter table notas add column destinatario text;
