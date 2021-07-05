import {strict as likeAr} from "like-ar";
import * as Path from "path"
import * as QRCode from 'qrcode';
import * as json4all from "json4all";
import * as bestGlobals from "best-globals";


import {BackendEngine, AppChi, generateTableDefinition} from "backend-chi";
import {
    IdentidadEngineBase, SessionBase
} from "../common/info-identidad"

import {dataSetRow} from "../common/info-identidad";
import * as BP from "backend-plus";
import { staticConfigYaml } from "./def-config"

import { tableUsuarios } from "backend-chi";
import { tableOperativos } from "./table-operativos";
import { tableAfectaciones } from "./table-afectaciones";
import { tableNotas } from "./table-notas";
import { URL, URLSearchParams } from "url";
import { promises as fs } from "fs";

var table = {
    ...dataSetRow,
    notas: tableNotas,
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
    async nota({idnota, mainDomain}:{idnota:string, mainDomain:string}){
        var urlObj=new URL(mainDomain);
        urlObj.search = new URLSearchParams([['idnota', idnota]]).toString()
        var urlStr = urlObj.toString();
        var banner = await fs.readFile('dist/client/unlogged/img/banner.html', 'utf8')
        try{
            var ahora = bestGlobals.date.today();
            var nota = await this.getTableData(table.notas, [{fieldName:'idnota', value:idnota}]);
            if(ahora < nota[0].desde){
                ahora = nota[0].desde;
            }else if(ahora>nota[0].hasta){
                ahora = nota[0].hasta
            }
            var verfique = `Verifique la autenticidad de esta nota con el QR o entrando a:`
            return {html:`<!doctype html>
            <html>
            <head>
                <style>
                body{margin:0px}
                #carta{max-width:640px; margin-left:auto; margin-right:auto; padding:20px; background-color:white;}
                </style>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>${banner}
            <div id=carta>\n${nota[0].contenido.replace(
                '<div id="auto-qr"></div>',
                `<div id="auto-qr"><div><img src="${await QRCode.toDataURL(urlStr, {margin:2})}"/></div><div style="font-size:50%"><div>${verfique}</div><div><a href=${urlStr}>${urlStr}</a></div></div></div>`
            ).replace(`<span id="fecha"></span>`,`<span id="fecha">${ahora.toLocaleDateString()}</span>`)}
            </div></body>`}
        }catch(err){
            console.log('RECURSO NO ENCONTRADO',idnota,err)
            return this.error404();
        }
    }
    override getUnloggedServices(){
        return {
            error404:{coreFunction:(_:any)     =>this.error404()      },
            verifid :{coreFunction:(params:any)=>this.verifid (params)},
            nota    :{coreFunction:(params:any)=>this.nota    (params), addParam:{mainDomain:true}}
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