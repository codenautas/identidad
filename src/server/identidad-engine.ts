import {strict as likeAr} from "like-ar";
import * as Path from "path"
import * as QRCode from 'qrcode';
import * as json4all from "json4all";


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
import { tableLotes } from "./table-lotes";
import { tableVariantes } from "./table-variantes";
import { URL, URLSearchParams } from "url";
import { promises as fs } from "fs";
import { tableNotas } from "./table-notas";

var table = {
    ...dataSetRow,
    notas: tableNotas,
    lotes: tableLotes,
    variantes: tableVariantes,
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
    async verifid({idafe}:{idafe:string}){
        var afectaciones = await this.getTableData(table.afectaciones, [{fieldName:'idafe', value:idafe}]);
        return {html:`<h2>${JSON.stringify(afectaciones)}</h2>`}
    }
    async nota({idv, mainDomain}:{idv:string, mainDomain:string}){
        var urlObj=new URL(mainDomain+'/nota');
        urlObj.search = new URLSearchParams([['idv', idv]]).toString()
        var urlStr = urlObj.toString();
        var banner = await fs.readFile('dist/client/unlogged/img/banner.html', 'utf8')
        var variante = await this.getTableData(table.variantes, [{fieldName:'idv', value:idv}]);
        var nv=variante[0];
        var ahora = nv.fecha;
        var destinatario = nv.destinatario || nv.notas__destinatario;
        var domicilio2 = nv.domicilio2 || 'Ciudad de Buenos Aires';
        var verfique = `Verifique la autenticidad de esta nota escaneando el QR o entrando a:`
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
        <div id=carta>\n${nv.notas__contenido.replace(
            '<div id="auto-qr"></div>',
            `<div id="auto-qr"><div><img src="${await QRCode.toDataURL(urlStr, {margin:2})}"/></div><div style="font-size:50%"><div>${verfique}</div><div><a href=${urlStr}>${urlStr}</a></div></div></div>`
        )
        .replace(`<span id="fecha"></span>`,ahora?`<span id="fecha">${ahora.toLocaleDateString()}</span>`:``)
        .replace(`<div id="destinatario"></div>`,destinatario?`<div id="destinatario">${destinatario}</div>`:``)
        .replace(`<div id="domicilio"></div>`,nv.domicilio?`<div id="domicilio">${nv.domicilio}</div>`:``)
        .replace(`<div id="domicilio2"></div>`,nv.domicilio?`<div id="domicilio2">${nv.codpos?`<span id="codpos">${nv.codpos}</span> - `:``} <span id="localidad">${domicilio2}</span></div>`:``)
        .replace('${alternativa}',nv.alternativa)
        }</div></body>`}
    }
    async lote({nota, lote, mainDomain}:{nota:number, lote:number, mainDomain:string}){
        var lotes = await this.getTableData(table.lotes, [{fieldName:'nota', value:nota},{fieldName:'lote', value:lote}]);
        var linfo = lotes[0];
        return {html:`<!doctype html>
            <h1> Carátula de impresión de notas. Nota ${nota}. LOTE ${lote}</h1>
            <div> ${mainDomain} </div>
            <div> ${linfo.cant_variantes} registros desde ${linfo.min_orden} hasta ${linfo.max_orden} </div>
            `
        }
    }
    override getUnloggedServices(){
        return {
            verifid :{coreFunction:(params:any)=>this.verifid (params), public:true},
            nota    :{coreFunction:(params:any)=>this.nota    (params), addParam:{mainDomain:true}, public:true},
            lote    :{coreFunction:(params:any)=>this.lote    (params), addParam:{mainDomain:true}}
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
            {menuType:'table', name:'notas'},
            {menuType:'menu', name:'operativos', selectedByDefault:true, menuContent:[
                {menuType:'table', name:'operativos'},
                {menuType:'table', name:'personal'},
            ]},
            ...super.getMenu(context).menu
        ];
        return {menu:menuContent};
    }
}