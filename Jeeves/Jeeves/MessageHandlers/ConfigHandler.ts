///<reference path="BaseHandler.ts"/>
///<reference path="../app.ts"/>

import { BaseGuildTextChannel, Message, Snowflake, TextBasedChannel } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { guildSettings, exportGuildSettings, addReactionResponseToList, logConfig } from "../app"
import { VoteChannel } from "../Objects/VoteChannel";
import { ChannelDefaults } from "../Objects/ChannelDefaults";

export class ConfigHandler extends BaseHandler {
    ingest(messageArray: string[], message: Message): boolean {
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        if (cmd === `${this.tradPrefix}setBotConfig`) {
            this.SetBotConfig(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}setUpvote`) {
            this.SetUpvote(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}setDefaultName`) {
            this.SetChannelDefault(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}revertChannelNames`) {
            this.RevertChannelsToDefault(args, message);
            return true;
        }

        if (cmd.toLowerCase() === `${this.tradPrefix}addreactionresponse`) {
            this.AddReactionResponse(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}outConfig`) {
            this.LogConfig(args, message);
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

        message.reply(`Set ${configChannel} as BotConfigChannel`);
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
        message.reply("Set " + args[0] + " as an upvote channel with emoji " + emoji);
    }

    ///
    /// !setDefault #channel: Sets the current name of the channel as its default
    /// !setDefault #channel [name]: Sets the default name of the channel to [name]
    ///
    SetChannelDefault(args: string[], message: Message) {
        if (args.length < 1 || args.length > 2) {
            message.channel.send("Well chop my salad and scramble my eggs, I don't know how to parse that message.");
            return;
        }

        var messageChannel: BaseGuildTextChannel;

        //Confirm message was sent in a text channel
        //TODO: Might not need this?
        try {
            messageChannel = message.channel as BaseGuildTextChannel
        }
        catch {
            message.channel.send("Terribly sorry. I cannot set defaults for channels other than text channels. If this was sent within a thread, that may have muckied up the process");
            return
        }

        var defaultName: string;

        //If only argument is channel, take its current name as default
        if (args.length == 1) {
            defaultName = messageChannel.name;
        }

        //If name is specified, set specified name as default
        if (args.length == 2) {
            defaultName = args[1];
        }

        //Create a channelDefaults object and add it to guildSettings
        var channelDefault = new ChannelDefaults(args[0], defaultName);
        guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.AddChannelDefault(channelDefault);
        message.reply(`Set ${defaultName} as default channel name for ${args[0]}`);
        exportGuildSettings(guildSettings);
    }

    ///
    /// Currently, this will revert all channels to default
    /// TODO: Can update it to do specific channels
    ///
    RevertChannelsToDefault(args: string[], message: Message) {
        var gs = guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)

        if (gs == undefined) {
            return;
        }

        var defaultNames = gs.defaultChannelNames

        for (var i = 0; i < defaultNames.length; i++) {
            var clippedSnowflake: string = defaultNames[i].channel.slice(2, -1);
            this.ChannelNamePromise(message, clippedSnowflake, defaultNames[i]);

            message.reply("Reverted channels to default names");
        }
    }

    //Given a channel name, change its name to 'defaults.defaultName'
    ChannelNamePromise(message: Message, clippedSnowflake: string, defaults: ChannelDefaults) {
        message.guild.channels.fetch(clippedSnowflake) //channel being saved as <#sldkfjslkj>, its looking for the slkdfjsldkfh
            .then(channel => (channel as BaseGuildTextChannel).setName(defaults.defaultName, "Jeeves !revert command"))
            .catch(err => console.log(err));
    }

    //Add a reaction response to Jeeves list of canned responses when @'ed
    AddReactionResponse(args: string[], message: Message) {
        var reactionResponseJoined: string = args.join(' ');
        addReactionResponseToList(reactionResponseJoined);
        message.reply("Successfully added message to list: " + reactionResponseJoined);
    }

    //Log Jeeves' config to console
    LogConfig(args: string[], message: Message) {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        logConfig("outConfig command");

    }
}