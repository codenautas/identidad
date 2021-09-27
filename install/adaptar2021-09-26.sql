set role to identidad_owner;
set search_path = identidad, public;

/*
alter table personal add column foto text;

-- */
alter table variantes add column cuil text;

ALTER TABLE identidad.afectaciones DROP CONSTRAINT "afectaciones personal REL";

alter table personal drop constraint personal_pkey;
alter table personal rename column cuit to cuil;
alter table personal add primary key (cuil);

ALTER TABLE identidad.afectaciones rename column cuit to cuil;

ALTER TABLE identidad.afectaciones
    ADD CONSTRAINT "afectaciones personal REL" FOREIGN KEY (cuil)
    REFERENCES identidad.personal (cuil) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
	
ALTER TABLE identidad.variantes 
    ADD CONSTRAINT "variantes personal REL" FOREIGN KEY (cuil)
    REFERENCES identidad.personal (cuil) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
	