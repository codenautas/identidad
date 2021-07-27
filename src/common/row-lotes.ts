
"use strict";
import {notas} from "./row-notas";
import {field, rowDefinition, foreignKeyField} from "boconccino"; 

const campos = {
    nota          : foreignKeyField(notas.field.nota,{registerAsDetail:{abr:'L'}}),
    lote          : new field.bigint({}),
    min_orden     : new field.bigint({}),
    max_orden     : new field.bigint({}),
    cant_variantes: new field.bigint({}),
    url           : new field.text({inTable:false, clientSide:'displayUrl', serverSide:true, editable:false}),
}

export const lotes = rowDefinition({
    name:'lotes',
    elementName:'lote',
    field:campos,
    primaryKey:['nota','lote'],
    editable:false,
});
