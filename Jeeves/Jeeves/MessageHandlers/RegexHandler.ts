import { Message } from "discord.js";
import { BaseHandler } from "./BaseHandler";


export class RegexHandler extends BaseHandler {

    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray: string[], message: Message): boolean {
        let ret: boolean = false;
        ret = ret || this.checkForSingleWords(messageArray, message);
        ret = ret || this.checkForPhrases(message);

        return ret;
    }

    checkForSingleWords(messageArray: string[], message: Message): boolean {
        let ret: boolean = false;
        //Remember: for/of gives a string, for/in gives an index
        for (let word of messageArray) { 
            this.checkStock(word, message);
            ret = ret || this.checkSmultimash(word, message);

        }
        return ret;
    }

    checkForPhrases(message: Message): boolean {
        let ret: boolean = false;
        ret = ret || this.checkForbiddenName(message)

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
}