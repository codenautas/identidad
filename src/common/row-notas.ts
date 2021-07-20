
"use strict";
import {field, rowDefinition} from "backend-chi"; 

const campos = {
    nota          : new field.bigint({sequence:true}),
    denominacion  : new field.text({title:'denominación', nullable:false}),
    observaciones : new field.text({}),
    contenido     : new field.text({}),
    destinatario  : new field.text({}),
}

export const notas = rowDefinition({
    name:'notas',
    elementName:'nota',
    field:campos,
    primaryKey:['nota'],
    editable:true
});
