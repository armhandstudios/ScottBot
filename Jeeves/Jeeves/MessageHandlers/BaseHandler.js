"use strict";
///<reference path="../botconfig.json"/>
exports.__esModule = true;
exports.BaseHandler = void 0;
var botconfig = require("../botconfig.json");
var BaseHandler = /** @class */ (function () {
    function BaseHandler() {
        this.tradPrefix = botconfig.tradPrefix; //traditional command prefix
        this.casPrefix = botconfig.casPrefix; //casual command prefix
        this.casQualifier = botconfig.casQualifier;
    }
    return BaseHandler;
}());
exports.BaseHandler = BaseHandler;
