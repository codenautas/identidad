"use strict";
import {field, relatedField, rowDefinition} from "backend-chi"; 
import {operativos} from "./row-operativos";
import {personal} from "./row-personal";

const campos = {
    operativo     : relatedField(operativos.field.operativo,{registerAsDetail:{abr:'A'}}),
    cuit          : relatedField(personal.field.cuit,{registerAsDetail:{abr:'A'}}),
    desde         : new field.date({}),
    hasta         : new field.date({}),
    observaciones : new field.text({})
}

export const afectaciones = rowDefinition({
    name:'afectaciones',
    elementName:'afectación',
    field:campos,
    primaryKey:['operativo', 'cuit'],
    editable:true,
})

