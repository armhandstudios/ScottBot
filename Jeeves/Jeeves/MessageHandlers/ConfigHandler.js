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
        try {
            messageChannel = message.channel;
        }
        catch {
            message.channel.send("Terribly sorry. I cannot set defaults for channels other than text channels. If this was sent within a thread, that may have muckied up the process");
            return;
        }
        var defaultName;
        if (args.length == 1) {
            defaultName = messageChannel.name;
        }
        if (args.length == 2) {
            defaultName = args[1];
        }
        var channelDefault = new ChannelDefaults_1.ChannelDefaults(args[0], defaultName);
        app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)?.AddChannelDefault(channelDefault);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    }
    ///
    /// Currently, this will revert all channels to default
    /// Can update it to do specific channels
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
        }
    }
    ChannelNamePromise(message, clippedSnowflake, defaults) {
        message.guild.channels.fetch(clippedSnowflake) //channel being saved as <#sldkfjslkj>, its looking for the slkdfjsldkfh
            .then(channel => channel.setName(defaults.defaultName, "Jeeves !revert command"))
            .catch(err => console.log(err));
    }
}
exports.ConfigHandler = ConfigHandler;
//# sourceMappingURL=ConfigHandler.js.map