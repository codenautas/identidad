"use strict";

import {IdentidadEngine} from '../server/identidad-engine';
import * as pg from 'pg-promise-strict';

pg.debug.pool=undefined;

describe("Identidad",()=>{
    describe("setup",()=>{
        it("inits", function(){
            var engine = new IdentidadEngine();
            console.log(engine);
        })
    });
});

console.log('reservar')
// testAll();