
"use strict";
// import { field } from "boconccino"; 
import { tableDefinition } from "boconccino"
import { lotes } from "../common/row-lotes"
import {TableDefinition, TableContext} from "backend-plus";

export const tableLotes = tableDefinition(
    lotes, {}, {
        dynamicAdapt:(tableDef:TableDefinition, context:TableContext)=>{
            var {be} = context;
            tableDef.sql = tableDef.sql||{};
            tableDef.sql.from=`
                (select nota, lote, max(orden) as max_orden, min(orden) as min_orden, count(*) as cant_variantes 
                    from variantes
                    group by nota, lote 
                    order by nota, lote)`;
            tableDef.sql.isTable = false;
            tableDef.sql.fields = tableDef.sql.fields||{};
            tableDef.sql.fields.url={expr:`${be.db.quoteLiteral(be.config.server.mainDomain+'/lote?nota=')}||lotes.nota||'&lote='||lotes.lote` }
            return tableDef;
        }
    },
);
