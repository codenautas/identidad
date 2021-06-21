import {FrontEndEngine} from "frontend-chi"

import {IdentidadEngineBase, SessionBase
} from "../common/info-identidad";
import * as json4all from "json4all";

import {SessionId} from "frontend-chi"


@json4all.addClass
class SessionData extends SessionBase{
}


class IdentidadEngine extends FrontEndEngine implements IdentidadEngineBase{
    static async _rpc<T>(functionName:string, method_args:any){
        var result:Promise<T> = my.ajax['identidad_'+functionName]({method_args})
        return result;
    }
    async getSession(session:SessionBase){
        return IdentidadEngine._rpc<SessionBase>('getSession', [session])
    }
    async getMoreInfo(session:SessionBase){
        return IdentidadEngine._rpc<SessionBase>('getMoreInfo', [session])
    }
}

class IdentidadFrontend{
    session:Readonly<SessionData> | undefined
    engine:IdentidadEngine
    constructor(sessionId:SessionId|null){
        this.engine = new IdentidadEngine(sessionId)
    } 
    setProp<TElement extends Element | CSSStyleDeclaration>(element:TElement, propName:keyof TElement, value:TElement[keyof TElement]){
        if(element[propName] != value){
            element[propName] = value
        }
    }
    async drawScreen(_addrParams:any){
    }
}

myOwn.wScreens.resumen = async function(addrParams){
    var url = new URLSearchParams(window.location.search.replace(/^[?]/,''))
    var identidadFrontend = new IdentidadFrontend(url.get('sessionId') as SessionId);
    identidadFrontend.drawScreen(addrParams)
}
