import {strict as likeAr} from "like-ar";
import * as Path from "path"
import {BackendEngine, AppChi, generateTableDefinition} from "backend-chi";
import {
    IdentidadEngineBase, SessionBase
} from "../common/info-identidad"
import * as json4all from "json4all";

import {dataSetRow} from "../common/info-identidad";
import * as BP from "backend-plus";
import { staticConfigYaml } from "./def-config"

import { tableUsuarios } from "backend-chi";
import { tableOperativos } from "./table-operativos";
import { tableAfectaciones } from "./table-afectaciones";
import bestGlobals = require("best-globals");

var table = {
    ...dataSetRow,
    operativos: tableOperativos,
    afectaciones: tableAfectaciones,
    usuarios: tableUsuarios,
}

@json4all.addClass
export class SessionData extends SessionBase{
}

var _typeBackendEngine:BackendEngine;

export class IdentidadEngine extends BackendEngine implements IdentidadEngineBase{
    async getSession(session:SessionData){
        return session;
    }
    override getTableDefinition():{[k:string]:(context:BP.TableContext)=>BP.TableDefinition}{
        return {
            ...super.getTableDefinition(),
            ...likeAr(table).map(def=>generateTableDefinition(def)).plain()
        };
    }
    // override getIncludes():ReturnType<BackendEngine.prototype.getIncludes>{
    override getIncludes(){
        var result:ReturnType<typeof _typeBackendEngine.getIncludes> = 
        [
            ...super.getIncludes(),
            { type: 'js', src: 'common/info-identidad.js' },
            // { type: 'js', src: 'common/identidad-engine.js' },
            { type: 'js', src: 'client/identidad-frontend.js' },
            // { type: 'js', src: 'client/menu.js' },
            { type: 'css', file: 'menu.css' },
            { type: 'css', path: 'client/css', file: 'identidad-frontend.css' },
        ]
        return result;
    }
    override async asyncPostConfig(){
        var {usuarios, parametros, ...resto} = dataSetRow;
        await this.getIncludesFromDataSetRow('node_modules/frontend-chi','common', {usuarios, parametros});
        await this.getIncludesFromDataSetRow(Path.join(__dirname,'../../client'),'common', {...resto});
    }
    async error404(){
        return {html:`<h2>ERROR 404. Recurso no encontrado</h2>`}
    }
    async verifid({idafe}:{idafe:string}){
        var afectaciones = await this.getTableData(table.afectaciones, [{fieldName:'idafe', value:idafe}]);
        return {html:`<h2>${JSON.stringify(afectaciones)}</h2>`}
    }
    async nota({idope}:{idope:string}){
        try{
            var ahora = bestGlobals.date.today();
            var operativo = await this.getTableData(table.operativos, [{fieldName:'idope', value:idope}]);
            if(ahora < operativo[0].desde || ahora > operativo[0].hasta){
                throw new Error("fuera de rango de fechas");
            }
            return {html:`<style>#carta{max-width:600px; margin-left:auto; margin-right:auto}</style><div id=carta>${operativo[0].carta}</div>`}
        }catch(err){
            console.log('RECURSO NO ENCONTRADO',idope,err)
            return this.error404();
        }
    }
    override getUnloggedServices(){
        return {
            error404:{coreFunction:(_:any)     =>this.error404()     },
            verifid :{coreFunction:(params:any)=>this.verifid (params)},
            nota    :{coreFunction:(params:any)=>this.nota    (params)}
        }
    }
}

export class AppIdentidad extends AppChi{
    /*
    constructor(init:{engine:IdentidadEngine}){
        super({
            engine:init.engine,
        })
    }
    override clientIncludes(req:BP.Request|null, opts:BP.OptsClientPage):BP.ClientModuleDefinition[]{
        var res:BP.ClientModuleDefinition[] = [
            ...super.clientIncludes(req, opts),
        ]
        return res;
    }
    */
    override configStaticConfig(){
        super.configStaticConfig();
        this.setStaticConfig(staticConfigYaml);
    }
    override getMenu(context:BP.Context):BP.MenuDefinition{
        var menuContent:BP.MenuInfoBase[]=[
            {menuType:'menu', name:'operativos', selectedByDefault:true, menuContent:[
                {menuType:'table', name:'operativos'},
                {menuType:'table', name:'personal'},
            ]},
            ...super.getMenu(context).menu
        ];
        return {menu:menuContent};
    }
}