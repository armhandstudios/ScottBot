import { Message } from "discord.js";
import { BaseHandler } from "./BaseHandler";
const botconfig = require("../botconfig.json");

export class RegexHandler extends BaseHandler {

    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray: string[], message: Message): boolean {
        let ret: boolean = false;
        ret = ret || this.checkForSingleWords(messageArray, message);
        ret = ret || this.checkForPhrases(messageArray, message);

        return ret;
    }

    checkForSingleWords(messageArray: string[], message: Message): boolean {
        let ret: boolean = false;
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

    checkForPhrases(messageArray: string[], message: Message): boolean {
        let ret: boolean = false;
        ret = ret || this.checkForbiddenName(message);
        ret = ret || this.checkTroints(message);
        ret = ret || this.checkHawkTuah(messageArray, message)

        return ret;
    }

    checkStock(word: string, message: Message): void {
        if (word.toLowerCase() == "stocks") {
            message.channel.send("*Stonks");
        }
        if (word.toLowerCase() == "stock") {
            message.channel.send("*Stonk");
        }
    }

    checkClanker(word: string, message: Message): void {
        if (word.toLowerCase() == "clanker" || word.toLowerCase() == "clankers") {
            message.channel.send("You can't say that word");
        }
    }

    checkSmultimash(word: string, message: Message): boolean {
        if (/^sm.*u.*sh/i.test(word)) {
            console.log("Fixing smush");
            message.channel.send("Looks like you made a typo. Lemme take care of that for you :)");
            message.delete().catch(O_o => { console.log("Couldn't delete?") });
            return true;
            //Todo: Send a message saying "person x says: message but smush is replaced"
        }
        return false;
    }

    checkForbiddenName(message: Message): boolean {
        if (/s.ot.?.*w.?oz.*/i.test(message.content.toLowerCase())) {
            console.log("How dare you say that name in this server");
            message.delete().catch(O_o => { console.log("Couldn't delete?") });
            return true;
        }
    }

    checkTroints(message: Message): boolean {
        if (/@everyone it.?s time fo+r.*/i.test(message.content.toLowerCase())) {
            console.log("troint time");
            message.channel.send({ files: [{ attachment: 'trivia_troints.png' }] });
            return true;
        }
    }

    checkHawkTuah(messageArray: string[], message: Message): boolean {
        for (let indexStr in messageArray.slice(0, -2)) {
            var index: number = Number.parseInt(indexStr);
            if (messageArray[index].toLowerCase() == 'to') {
                if (messageArray[index + 1].toLowerCase() == 'a') {
                    console.log("Hawk Tuah detected")
                    if (Math.random() > 0.9) {
                        message.channel.send(`Hawk Tuah ${messageArray[index + 2]}`);
                        return true;
                    }
                }
            }
        }

    }
}