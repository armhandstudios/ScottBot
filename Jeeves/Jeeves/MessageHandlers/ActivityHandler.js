"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
///
/// The purpose of this class is to manually track things that aren't easily queriable. By recording recent messages, we can
/// Do things like !unedit, !undelete, etc
/// This will also serve as a handler for general activity commands
///
class ActivityHandler extends BaseHandler_1.BaseHandler {
    constructor() {
        super();
        if (ActivityHandler.lastHeatedDebate == null) {
            ActivityHandler.lastHeatedDebate = Date.now();
        }
    }
    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray, message) {
        let ret = false;
        ret = ret || this.heatedDebate(message);
        return ret;
    }
    //Once a day, if multiple people are talking, jeeves can chime in
    heatedDebate(message) {
        let channel = message.channel;
        //Only use this command once a day at most
        var curTime = Date.now().valueOf();
        if (curTime < ActivityHandler.lastHeatedDebate.valueOf() + 86400000) {
            return true;
        }
        var lastFiveMessages = channel.messages.cache.last(5);
        console.log `Last Five - ${lastFiveMessages}`;
        //Channel must be at least 5 messages old
        if (lastFiveMessages.length < 5) {
            return true;
        }
        //Count the number of unique chatters among the last five messages
        var uniqueAuthors = new Set(lastFiveMessages.map(msg => msg.author));
        //If the last five messages took place within 30 seconds and include at least 3 people
        if (lastFiveMessages[0].createdAt.valueOf() > lastFiveMessages[4].createdAt.valueOf() - 30000
            && uniqueAuthors.size >= 3) {
            switch (Math.floor(Math.random() * 5)) {
                case 0:
                    channel.send("Mom, Dad, stop fighting");
                    break;
                case 1:
                    channel.send(`I agree with ${lastFiveMessages[4].author.toString()}`);
                    break;
                case 2:
                    channel.send("I am also here");
                    break;
                case 3:
                    channel.send("What are we even talking about anymore?");
                    break;
                case 4:
                    channel.send("Make sure you're running a load of laundry");
                    break;
            }
            ActivityHandler.lastHeatedDebate = Date.now();
        }
        return true;
    }
}
exports.ActivityHandler = ActivityHandler;
//# sourceMappingURL=ActivityHandler.js.map