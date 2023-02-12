///<reference path="BaseHandler.ts"/>
///<reference path="../app.ts"/>

import { Message } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { guildSettings, exportGuildSettings } from "../app"
import { VoteChannel } from "../Objects/VoteChannel";

export class ConfigHandler extends BaseHandler {
    ingest(messageArray: string[], message: Message): boolean {
        let cmd = messageArray[0];
        let args = messageArray.slice[1];
        if (cmd === `${this.tradPrefix}setBotConfig`) {
            this.SetBotConfig(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}setUpvote`) {
            this.SetUpvote(args, message);
            return true;
        }
            
    }

    SetBotConfig(args: string[], message: Message): void {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        var configChannel: string | undefined = undefined;
        console.log("Setting config channel");

        //TODO: Validate that parameter is a valid channel
        if (args.length == 1) {
            configChannel = args[0];
            console.log(`Config Channel = ${configChannel}`);
        }
        else {
            configChannel = message.channel.id;
            console.log(`Config Channel = ${configChannel}`);
        }
        if (configChannel != undefined) {
            console.log("Executing SetConfigChannel");
            guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.SetConfigChannel(configChannel);
        }
        exportGuildSettings(guildSettings);
    }

    SetUpvote(args: string[], message: Message) {
        if (args.length < 1 || args.length > 2) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        var emoji: string;
        if (args.length == 2) {
            emoji = args[1];
        }
        else {
            emoji = '👍';
        }
        var upvoteChannel = new VoteChannel(args[0], emoji);
        console.log(upvoteChannel);
        guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.SetVoteChannel(upvoteChannel);
        exportGuildSettings(guildSettings);
    }
}