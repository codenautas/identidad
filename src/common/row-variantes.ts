
"use strict";
import {notas} from "./row-notas";
import {field, rowDefinition, foreignKeyField, foreignField} from "boconccino"; 

const campos = {
    nota          : foreignKeyField(notas.field.nota,{registerAsDetail:{abr:'V'}}),
    lote          : new field.bigint({}),
    orden         : new field.bigint({}),
    observaciones : new field.text({}),
    fecha         : new field.date({}),
    destinatario  : new field.text({}),
    domicilio     : new field.text({}),
    domicilio2    : new field.text({}),
    codpos        : new field.text({}),
    idv           : new field.text({}),
    url           : new field.text({inTable:false, clientSide:'displayUrl', serverSide:true, editable:false}),
    alternativa   : new field.text({}),
    notas__contenido   : foreignField(notas.field.contenido   ,{}),
    notas__destinatario: foreignField(notas.field.destinatario,{}),
}

export const variantes = rowDefinition({
    name:'variantes',
    elementName:'variante',
    field:campos,
    primaryKey:['nota','lote','orden'],
    editable:true,
    hiddenColumns:['notas__contenido', 'notas__destinatario']
});
