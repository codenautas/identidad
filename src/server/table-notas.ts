
"use strict";
// import { field } from "backend-chi"; 
import { tableDefinition } from "backend-chi"
import { notas } from "../common/row-notas"

export const tableNotas = tableDefinition(
    notas, {}, {
        sql:{
            policies:{
                all   :{using:'not confirmada', check:'true'},
                select:{using:'true'}
            },
        }
    },
);
