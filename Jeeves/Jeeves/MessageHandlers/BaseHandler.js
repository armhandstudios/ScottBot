"use strict";
///<reference path="../botconfig.json"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
const botconfig = require("../botconfig.json");
class BaseHandler {
    constructor() {
        this.tradPrefix = botconfig.tradPrefix; //traditional command prefix
        this.casPrefix = botconfig.casPrefix; //casual command prefix
        this.casQualifier = botconfig.casQualifier;
    }
}
exports.BaseHandler = BaseHandler;
//# sourceMappingURL=BaseHandler.js.map