"use strict";
// import { field } from "boconccino"; 
import { tableDefinition } from "boconccino"
import { afectaciones } from "../common/row-afectaciones"; 
import {TableDefinition, TableContext} from "backend-plus";

const campos = {
}

export const tableAfectaciones = tableDefinition(
    afectaciones, campos, {
        dynamicAdapt:(tableDef:TableDefinition, context:TableContext)=>{
            var idafeField = tableDef.fields.find(field=>field.name=='idafe')!;
            idafeField.generatedAs = `(translate(encode(digest(${context.be.db.quoteLiteral(context.be.config.server.prefix_idafe)}||operativo||'-'||cuit, 'sha1'), 'base64'),'+/=','_.'))`
            return tableDef;
        }
    },
);
