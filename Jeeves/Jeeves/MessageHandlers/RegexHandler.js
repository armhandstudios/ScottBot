"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.RegexHandler = void 0;
var BaseHandler_1 = require("./BaseHandler");
var RegexHandler = /** @class */ (function (_super) {
    __extends(RegexHandler, _super);
    function RegexHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    RegexHandler.prototype.ingest = function (messageArray, message) {
        var ret = false;
        ret = ret || this.checkForSingleWords(messageArray, message);
        ret = ret || this.checkForPhrases(message);
        return ret;
    };
    RegexHandler.prototype.checkForSingleWords = function (messageArray, message) {
        var ret = false;
        //Remember: for/of gives a string, for/in gives an index
        for (var _i = 0, messageArray_1 = messageArray; _i < messageArray_1.length; _i++) {
            var word = messageArray_1[_i];
            this.checkStock(word, message);
            ret = ret || this.checkSmultimash(word, message);
        }
        return ret;
    };
    RegexHandler.prototype.checkForPhrases = function (message) {
        var ret = false;
        ret = ret || this.checkForbiddenName(message);
        return ret;
    };
    RegexHandler.prototype.checkStock = function (word, message) {
        if (word.toLowerCase() == "stocks") {
            message.channel.send("*Stonks");
        }
        if (word.toLowerCase() == "stock") {
            message.channel.send("*Stonk");
        }
    };
    RegexHandler.prototype.checkSmultimash = function (word, message) {
        if (/^sm.*u.*sh/i.test(word)) {
            console.log("Fixing smush");
            message.channel.send("Looks like you made a typo. Lemme take care of that for you :)");
            message["delete"]()["catch"](function (O_o) { console.log("Couldn't delete?"); });
            return true;
            //Todo: Send a message saying "person x says: message but smush is replaced"
        }
        return false;
    };
    RegexHandler.prototype.checkForbiddenName = function (message) {
        if (/s.ot.?.*w.?oz.*/i.test(message.content.toLowerCase())) {
            console.log("How dare you say that name in this server");
            message["delete"]()["catch"](function (O_o) { console.log("Couldn't delete?"); });
            return true;
        }
    };
    return RegexHandler;
}(BaseHandler_1.BaseHandler));
exports.RegexHandler = RegexHandler;
