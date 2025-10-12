"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
const botconfig = require("../botconfig.json");
class RegexHandler extends BaseHandler_1.BaseHandler {
    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray, message) {
        let ret = false;
        ret = ret || this.checkForSingleWords(messageArray, message);
        ret = ret || this.checkForPhrases(messageArray, message);
        return ret;
    }
    //Functions that check if a single word or short regex exists in the message array
    checkForSingleWords(messageArray, message) {
        let ret = false;
        //Remember: for/of gives a string, for/in gives an index
        for (let word of messageArray) {
            this.checkStock(word, message);
            this.checkClanker(word, message);
            if (botconfig.deleteSmush) {
                ret = ret || this.checkSmultimash(word, message);
            }
        }
        return ret;
    }
    //Functions that check if a combination of words or larger regexes exist in the message array
    checkForPhrases(messageArray, message) {
        let ret = false;
        //ret = ret || this.checkForbiddenName(message);
        ret = ret || this.checkTroints(message);
        ret = ret || this.checkHawkTuah(messageArray, message);
        return ret;
    }
    //If 'stock' is in a message, post the correction '*Stonk'
    checkStock(word, message) {
        if (word.toLowerCase() == "stocks") {
            message.channel.send("*Stonks");
        }
        if (word.toLowerCase() == "stock") {
            message.channel.send("*Stonk");
        }
    }
    //Disapprove if the word 'Clanker' is posted
    checkClanker(word, message) {
        if (word.toLowerCase() == "clanker" || word.toLowerCase() == "clankers") {
            message.channel.send("You can't say that word");
        }
    }
    //Do not allow smush, smultimash, or any bastardization of Smash Ultimate to be posted
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
    //Do not allow Scott The Woz to be posted
    checkForbiddenName(message) {
        if (/s.ot.?.*w.?oz.*/i.test(message.content.toLowerCase())) {
            console.log("How dare you say that name in this server");
            message.delete().catch(O_o => { console.log("Couldn't delete?"); });
            return false;
        }
    }
    //If user types '@everyone it's time for`, respond with the trivia troints image
    checkTroints(message) {
        if (/@everyone it.?s time fo+r.*/i.test(message.content.toLowerCase())) {
            console.log("troint time");
            message.channel.send({ files: [{ attachment: 'trivia_troints.png' }] });
            return true;
        }
    }
    //If user types ... to a big store ..., respond with hawk tuah big store
    checkHawkTuah(messageArray, message) {
        for (let indexStr in messageArray.slice(0, -2)) {
            var index = Number.parseInt(indexStr);
            if (messageArray[index].toLowerCase() == 'to') {
                if (messageArray[index + 1].toLowerCase() == 'a') {
                    console.log("Hawk Tuah detected");
                    if (Math.random() > 0.9) {
                        if (messageArray.length >= index + 2)
                            message.channel.send(`Hawk Tuah ${messageArray[index + 3]}`);
                        else
                            message.channel.send(`Hawk Tuah ${messageArray[index + 2]}`);
                        return true;
                    }
                }
            }
        }
    }
}
exports.RegexHandler = RegexHandler;
//# sourceMappingURL=RegexHandler.js.map