
"use strict";
// import { field } from "backend-chi"; 
import { tableDefinition } from "backend-chi"
import { variantes } from "../common/row-variantes"
import {TableDefinition, TableContext} from "backend-plus";

export const tableVariantes = tableDefinition(
    variantes, {}, {
        dynamicAdapt:(tableDef:TableDefinition, context:TableContext)=>{
            var {be} = context;
            var idvField = tableDef.fields.find(field=>field.name=='idv')!;
            idvField.defaultDbValue = `substr(random()::text,3)`;
            tableDef.sql = tableDef.sql||{};
            tableDef.sql.fields = tableDef.sql.fields||{};
            tableDef.sql.fields.url={expr:`${be.db.quoteLiteral(be.config.server.mainDomain+'/nota?idv=')}||idv` }
            return tableDef;
        }
    },
);
