"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
class RegexHandler extends BaseHandler_1.BaseHandler {
    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray, message) {
        let ret = false;
        ret = ret || this.checkForSingleWords(messageArray, message);
        ret = ret || this.checkForPhrases(message);
        return ret;
    }
    checkForSingleWords(messageArray, message) {
        let ret = false;
        //Remember: for/of gives a string, for/in gives an index
        for (let word of messageArray) {
            this.checkStock(word, message);
            ret = ret || this.checkSmultimash(word, message);
        }
        return ret;
    }
    checkForPhrases(message) {
        let ret = false;
        ret = ret || this.checkForbiddenName(message);
        return ret;
    }
    checkStock(word, message) {
        if (word.toLowerCase() == "stocks") {
            message.channel.send("*Stonks");
        }
        if (word.toLowerCase() == "stock") {
            message.channel.send("*Stonk");
        }
    }
    checkSmultimash(word, message) {
        if (/^sm.*u.*sh/i.test(word)) {
            console.log("Fixing smush");
            message.channel.send("Looks like you made a typo. Lemme take care of that for you :)");
            message.delete().catch(O_o => { console.log("Couldn't delete?"); });
            return true;
            //Todo: Send a message saying "person x says: message but smush is replaced"
        }
        return false;
    }
    checkForbiddenName(message) {
        if (/s.ot.?.*w.?oz.*/i.test(message.content.toLowerCase())) {
            console.log("How dare you say that name in this server");
            message.delete().catch(O_o => { console.log("Couldn't delete?"); });
            return true;
        }
    }
}
exports.RegexHandler = RegexHandler;
//# sourceMappingURL=RegexHandler.js.map