"use strict";
// import { field } from "boconccino"; 
import { tableDefinition } from "boconccino"
import { operativos } from "../common/row-operativos"; 
import {TableDefinition, TableContext} from "backend-plus";

const campos = {
}

export const tableOperativos = tableDefinition(
    operativos, campos, {
        dynamicAdapt:(tableDef:TableDefinition, context:TableContext)=>{
            var idopeField = tableDef.fields.find(field=>field.name=='idope')!;
            idopeField.generatedAs = `(translate(encode(digest(${context.be.db.quoteLiteral(context.be.config.server.prefix_idope)}||operativo, 'sha1'), 'base64'),'+/=','_.'))`
            return tableDef;
        }
    },
);
