
"use strict";
import {notas} from "./row-notas";
import {personal} from "./row-personal";
import {field, rowDefinition, foreignKeyField, foreignField} from "backend-chi"; 

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
    confirmada    : new field.boolean({nullable:false, default:false}),
    notas__contenido   : foreignField(notas.field.contenido   ,{}),
    notas__destinatario: foreignField(notas.field.destinatario,{}),
    notas__confirmada  : foreignField(notas.field.confirmada  ,{}),
    cuil          : foreignKeyField(personal.field.cuil,{registerAsDetail:{abr:'N'}}),
    personal__documento_tipo:  foreignField(personal.field.documento_tipo ,{}),
    personal__documento_nro :  foreignField(personal.field.documento_nro  ,{}),
    personal__apellido      :  foreignField(personal.field.apellido       ,{}),
    personal__nombres       :  foreignField(personal.field.nombres        ,{}),
    personal__cuil          :  foreignField(personal.field.cuil           ,{}),
    personal__foto          :  foreignField(personal.field.foto           ,{}),
}

export const variantes = rowDefinition({
    name:'variantes',
    elementName:'variante',
    field:campos,
    primaryKey:['nota','lote','orden'],
    editable:true,
    hiddenColumns:['notas__contenido', 'notas__destinatario']
});
