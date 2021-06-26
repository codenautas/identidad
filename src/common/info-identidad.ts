import * as json4all from "json4all";
import {notas} from "./row-notas";
import {operativos} from "./row-operativos";
import {afectaciones} from "./row-afectaciones";
import {personal} from "./row-personal";
import {usuarios} from "frontend-chi";
import {parametros} from "frontend-chi";

export const dataSetRow ={
    notas,
    operativos,
    personal,
    afectaciones,
    usuarios,
    parametros
}

export type InfoSession = 'algo=1&asi=2'

@json4all.addClass
export class SessionBase{
    @json4all.addProperty public infoSession:InfoSession|null = null
    constructor(){}
}

export type NormalizedName = 'all_lower_string'|'lowers'|'no_signs'|'1or2numbers_or_more';

export function normalizeName(name:string){
    return (name.trim()
        .replace(/[áÁàÀäÄãÃ]/g,'a')
        .replace(/[éÉèÈëË]/g,'e')
        .replace(/[íÍìÌïÏ]/g,'i')
        .replace(/[óÓòÒöÖõÕ]/g,'o')
        .replace(/[úÚùÙüÜ]/g,'u')
        .replace(/[ýÝÿ]/g,'y')
        .replace(/[ñÑ]/g,'n')
        .toLocaleLowerCase()
        .replace(/[^a-zñ0-9]/g,'_')
    )
}

export interface IdentidadEngineBase{
    getSession(session?:SessionBase):Promise<SessionBase>
}

export type GetClassName<ClassName extends string> = `get${ClassName}`;

// export type KnownClassName = `get${string}` extends GetFunctions; 

export type MyGetters = keyof IdentidadEngineBase;

// export type KnownClassName = Extract<MyGetters extends GetClassName<infer U> ? U : never>;
export type KnownClassName<K = keyof IdentidadEngineBase> = K extends GetClassName<infer U> ? U : never;

export type PublicMethod = ({className:'global'} | {className:KnownClassName, idLength:number} ) & {sessionId?:boolean}

export const publicMethods:{[k:string]: PublicMethod}={
    getMoreInfo:{className:'global', sessionId:true},
};

export type publicMethodsNames = keyof typeof publicMethods;

export function randomNatural(maximo:number){
    return Math.floor(Math.random()*maximo+1)
}

export function extraerUnoAlAzar<T>(lista:T[]):T{
    return lista.splice(randomNatural(lista.length)-1,1)[0];
}

export function rgbToHex(r:number, g:number, b:number) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
