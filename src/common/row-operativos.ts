"use strict";
import {field, rowDefinition} from "backend-chi"; 

const campos = {
    operativo     : new field.text({}),
    denominacion  : new field.text({}),
    desde         : new field.date({}),
    hasta         : new field.date({})
}

export const operativos = rowDefinition({
    name:'operativos',
    elementName:'operativo',
    field:campos,
    primaryKey:['operativo'],
    editable:true
});
