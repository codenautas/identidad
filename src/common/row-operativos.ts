"use strict";
import {field, relatedField, rowDefinition} from "backend-chi"; 
import {notas} from "./row-notas";

const campos = {
    operativo     : new field.text({}),
    denominacion  : new field.text({}),
    desde         : new field.date({}),
    hasta         : new field.date({}),
    nota          : relatedField(notas.field.nota,{registerAsDetail:{abr:'N'}}),
    idope         : new field.text({})
}

export const operativos = rowDefinition({
    name:'operativos',
    elementName:'operativo',
    field:campos,
    primaryKey:['operativo'],
    editable:true
});
