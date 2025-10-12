///<reference path="../botconfig.json"/>

import { Client, DiscordAPIError, Guild, Message, Embed, TextChannel, ColorResolvable } from "discord.js";

const botconfig = require("../botconfig.json");

//Base class for message handlers
export abstract class BaseHandler {
    tradPrefix: string = botconfig.tradPrefix;      //traditional command prefix
    casPrefix: string = botconfig.casPrefix;        //casual command prefix
    casQualifier: string = botconfig.casQualifier

    //Bot.onMessage will call ingest, passing in the messageArray as well as the Message.
    //Ingest will then pass the message to further functions to be processed.
    abstract ingest(messageArray: string[], message: Message): boolean
}