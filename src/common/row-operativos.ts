"use strict";
import {field, rowDefinition} from "backend-chi"; 

const campos = {
    operativo     : new field.text({}),
    denominacion  : new field.text({}),
    desde         : new field.date({}),
    hasta         : new field.date({}),
    carta         : new field.text({}),
    idope         : new field.text({})
}

export const operativos = rowDefinition({
    name:'operativos',
    elementName:'operativo',
    field:campos,
    primaryKey:['operativo'],
    editable:true
});
