"use strict";
import {field, foreignKeyField, rowDefinition} from "backend-chi"; 
import {operativos} from "./row-operativos";
import {personal} from "./row-personal";

const campos = {
    operativo     : foreignKeyField(operativos.field.operativo,{registerAsDetail:{abr:'A'}}),
    cuil          : foreignKeyField(personal.field.cuil,{registerAsDetail:{abr:'A'}}),
    desde         : new field.date({}),
    hasta         : new field.date({}),
    observaciones : new field.text({}),
    idafe         : new field.text({})
}

export const afectaciones = rowDefinition({
    name:'afectaciones',
    elementName:'afectación',
    field:campos,
    primaryKey:['operativo', 'cuil'],
    editable:true,
})

