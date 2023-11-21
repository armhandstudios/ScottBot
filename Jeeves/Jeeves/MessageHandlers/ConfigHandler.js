"use strict";
///<reference path="BaseHandler.ts"/>
///<reference path="../app.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ConfigHandler = void 0;
var BaseHandler_1 = require("./BaseHandler");
var app_1 = require("../app");
var VoteChannel_1 = require("../Objects/VoteChannel");
var ConfigHandler = /** @class */ (function (_super) {
    __extends(ConfigHandler, _super);
    function ConfigHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfigHandler.prototype.ingest = function (messageArray, message) {
        var cmd = messageArray[0];
        var args = messageArray.slice[1];
        if (cmd === "".concat(this.tradPrefix, "setBotConfig")) {
            this.SetBotConfig(args, message);
            return true;
        }
        if (cmd === "".concat(this.tradPrefix, "setUpvote")) {
            this.SetUpvote(args, message);
            return true;
        }
    };
    ConfigHandler.prototype.SetBotConfig = function (args, message) {
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
            console.log("Config Channel = ".concat(configChannel));
        }
        else {
            configChannel = message.channel.id;
            console.log("Config Channel = ".concat(configChannel));
        }
        if (configChannel != undefined) {
            console.log("Executing SetConfigChannel");
            (_a = app_1.guildSettings.find(function (guildSetting) { return guildSetting.guildId === message.guild.id; })) === null || _a === void 0 ? void 0 : _a.SetConfigChannel(configChannel);
        }
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    };
    ConfigHandler.prototype.SetUpvote = function (args, message) {
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
        (_a = app_1.guildSettings.find(function (guildSetting) { return guildSetting.guildId === message.guild.id; })) === null || _a === void 0 ? void 0 : _a.SetVoteChannel(upvoteChannel);
        (0, app_1.exportGuildSettings)(app_1.guildSettings);
    };
    return ConfigHandler;
}(BaseHandler_1.BaseHandler));
exports.ConfigHandler = ConfigHandler;
