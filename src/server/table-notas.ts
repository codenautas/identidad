
"use strict";
// import { field } from "backend-chi"; 
import { tableDefinition } from "backend-chi"
import { notas } from "../common/row-notas"
import {TableDefinition, TableContext} from "backend-plus";

export const tableNotas = tableDefinition(
    notas, {}, {
        dynamicAdapt:(tableDef:TableDefinition, context:TableContext)=>{
            var {be} = context;
            var idnotaField = tableDef.fields.find(field=>field.name=='idnota')!;
            // idnotaField.generatedAs = `(translate(encode(digest(${context.be.db.quoteLiteral(context.be.config.server.prefix_idnota)}||operativo, 'sha1'), 'base64'),'+/=','_.'))`
            idnotaField.defaultDbValue = `substr(random()::text,3)`;
            tableDef.sql = tableDef.sql||{};
            tableDef.sql.fields = tableDef.sql.fields||{};
            tableDef.sql.fields.url={expr:`${be.db.quoteLiteral(be.config.server.mainDomain+'/nota?idnota=')}||idnota` }
            return tableDef;
        }
    },
);
