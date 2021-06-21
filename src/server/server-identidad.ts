"use strict";

import {AppIdentidad, IdentidadEngine} from "./identidad-engine";

var engine = new IdentidadEngine();
new AppIdentidad({engine}).start();