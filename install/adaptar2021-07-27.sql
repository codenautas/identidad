set role to identidad_owner;
set search_path = identidad, public;

alter table notas add column confirmada boolean default false not null;

alter table variantes add column confirmada boolean default false not null;

ALTER TABLE "notas" ENABLE ROW LEVEL SECURITY;
CREATE POLICY bp_pol_all ON "notas" AS PERMISSIVE FOR all USING ( not confirmada ) WITH CHECK ( true );
CREATE POLICY bp_pol_select ON "notas" AS PERMISSIVE FOR select USING ( true );
ALTER TABLE "variantes" ENABLE ROW LEVEL SECURITY;
CREATE POLICY bp_pol_all ON "variantes" AS PERMISSIVE FOR all USING ( not confirmada ) WITH CHECK ( true );
CREATE POLICY bp_pol_select ON "variantes" AS PERMISSIVE FOR select USING ( true );
