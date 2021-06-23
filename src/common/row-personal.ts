"use strict";
import {field, rowDefinition} from "backend-chi"; 

export const campos = {
    cuit          : new field.text({}),
    nombres       : new field.text({isName:true}),
    apellido      : new field.text({isName:true}),
    documento_tipo: new field.text({default:'DNI'}),
    documento_nro : new field.text({}),
    telefono      : new field.text({title:'teléfono'}),
    mail          : new field.text({}),
    mail_alternativo: new field.text({}),
}

export const personal = rowDefinition({
    name:'personal',
    elementName:'persona',
    editable:true,
    field:campos,
    primaryKey:['cuit']
});
