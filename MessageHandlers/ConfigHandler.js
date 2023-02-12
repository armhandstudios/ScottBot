"use strict";
///<reference path="BaseHandler.ts"/>
///<reference path="../app.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
const app_1 = require("../app");
const VoteChannel_1 = require("../Objects/VoteChannel");
class ConfigHandler extends BaseHandler_1.BaseHandler {
    ingest(messageArray, message) {
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
    SetBotConfig(args, message) {
        var _a;
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
            (_a = app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)) === null || _a === void 0 ? void 0 : _a.SetConfigChannel(configChannel);
        }
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    }
    SetUpvote(args, message) {
        var _a;
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
        (_a = app_1.guildSettings.find(guildSetting => guildSetting.guildId === message.guild.id)) === null || _a === void 0 ? void 0 : _a.SetVoteChannel(upvoteChannel);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    }
}
exports.ConfigHandler = ConfigHandler;
//# sourceMappingURL=ConfigHandler.js.map