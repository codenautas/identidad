
"use strict";
import {field, rowDefinition} from "backend-chi"; 

const campos = {
    nota          : new field.bigint({sequence:true}),
    denominacion  : new field.text({title:'denominación'}),
    observaciones : new field.text({}),
    desde         : new field.date({}),
    hasta         : new field.date({}),
    contenido     : new field.text({}),
    idnota        : new field.text({}),
}

export const notas = rowDefinition({
    name:'notas',
    elementName:'nota',
    field:campos,
    primaryKey:['nota'],
    editable:true
});
