///<reference path="../botconfig.json"/>

import { Client, DiscordAPIError, Guild, Message, Embed, TextChannel } from "discord.js";

const botconfig = require("../botconfig.json");

export abstract class BaseHandler {
    tradPrefix: string = botconfig.tradPrefix;      //traditional command prefix
    casPrefix: string = botconfig.casPrefix;        //casual command prefix
    casQualifier: string = botconfig.casQualifier

    abstract ingest(messageArray: string[], message: Message): boolean
}