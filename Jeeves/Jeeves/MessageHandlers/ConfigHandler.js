"use strict";
///<reference path="BaseHandler.ts"/>
///<reference path="../app.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
const app_1 = require("../app");
const VoteChannel_1 = require("../Objects/VoteChannel");
const ChannelDefaults_1 = require("../Objects/ChannelDefaults");
class ConfigHandler extends BaseHandler_1.BaseHandler {
    ingest(messageArray, message) {
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);
        if (cmd === `${this.tradPrefix}setbotconfig`) {
            this.SetBotConfig(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}setupvote`) {
            this.SetUpvote(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}clearupvote`) {
            this.ClearUpvote(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}setdefaultname`) {
            this.SetChannelDefault(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}removedefaultname`) {
            this.RemoveChannelDefault(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}revertchannelnames`) {
            this.RevertChannelsToDefault(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}addreactionresponse`) {
            this.AddReactionResponse(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}outconfig`) {
            this.LogConfig(args, message);
            return true;
        }
    }
    SetBotConfig(args, message) {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        var configChannel = undefined;
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
            app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.SetConfigChannel(configChannel);
        }
        message.reply(`Set ${configChannel} as BotConfigChannel`);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    }
    SetUpvote(args, message) {
        if (args.length < 1 || args.length > 2) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        var emoji;
        if (args.length == 2) {
            emoji = args[1];
        }
        else {
            emoji = '👍';
        }
        var upvoteChannel = new VoteChannel_1.VoteChannel(args[0], emoji);
        console.log(upvoteChannel);
        app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.SetVoteChannel(upvoteChannel);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
        message.reply("Set " + args[0] + " as an upvote channel with emoji " + emoji);
    }
    ClearUpvote(args, message) {
        if (args.length != 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
        }
        app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.ClearVoteChannel(args[0]);
        message.reply("Removed all upvote configurations from channel " + args[0]);
    }
    ///
    /// !setDefault #channel: Sets the current name of the channel as its default
    /// !setDefault #channel [name]: Sets the default name of the channel to [name]
    ///
    SetChannelDefault(args, message) {
        if (args.length < 1 || args.length > 2) {
            message.channel.send("Well chop my salad and scramble my eggs, I don't know how to parse that message.");
            return;
        }
        var messageChannel;
        //Confirm message was sent in a text channel
        //TODO: Might not need this?
        try {
            messageChannel = message.channel;
        }
        catch {
            message.channel.send("Terribly sorry. I cannot set defaults for channels other than text channels. If this was sent within a thread, that may have muckied up the process");
            return;
        }
        var defaultName;
        //If only argument is channel, take its current name as default
        //Bug: Sets message channel's name, not channel's current name
        if (args.length == 1) {
            defaultName = messageChannel.name;
        }
        //If name is specified, set specified name as default
        if (args.length == 2) {
            defaultName = args[1];
        }
        //Create a channelDefaults object and add it to guildSettings
        var channelDefault = new ChannelDefaults_1.ChannelDefaults(args[0], defaultName);
        app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.AddChannelDefault(channelDefault);
        message.reply(`Set ${defaultName} as default channel name for ${args[0]}`);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    }
    RemoveChannelDefault(args, message) {
        if (args.length != 1) {
            message.channel.send("Well chop my salad and scramble my eggs, I don't know how to parse that message.");
        }
        app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.RemoveChannelDefault(args[0]);
        message.reply(`Removed default for channel ${args[0]}`);
    }
    ///
    /// Currently, this will revert all channels to default
    /// TODO: Can update it to do specific channels
    ///
    RevertChannelsToDefault(args, message) {
        var gs = app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id);
        if (gs == undefined) {
            return;
        }
        var defaultNames = gs.defaultChannelNames;
        for (var i = 0; i < defaultNames.length; i++) {
            var clippedSnowflake = defaultNames[i].channel.slice(2, -1);
            this.ChannelNamePromise(message, clippedSnowflake, defaultNames[i]);
            message.reply("Reverted channels to default names");
        }
    }
    //Given a channel name, change its name to 'defaults.defaultName'
    ChannelNamePromise(message, clippedSnowflake, defaults) {
        message.guild.channels.fetch(clippedSnowflake) //channel being saved as <#sldkfjslkj>, its looking for the slkdfjsldkfh
            .then(channel => channel.setName(defaults.defaultName, "Jeeves !revert command"))
            .catch(err => console.log(err));
    }
    //Add a reaction response to Jeeves list of canned responses when @'ed
    AddReactionResponse(args, message) {
        var reactionResponseJoined = args.join(' ');
        (0, app_1.addReactionResponseToList)(reactionResponseJoined);
        message.reply("Successfully added message to list: " + reactionResponseJoined);
    }
    //Log Jeeves' config to console
    LogConfig(args, message) {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        (0, app_1.logConfig)("outConfig command");
    }
}
exports.ConfigHandler = ConfigHandler;
//# sourceMappingURL=ConfigHandler.js.map