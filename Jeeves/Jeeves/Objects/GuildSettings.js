"use strict";
/// <reference path="VoteChannel.ts" />
exports.__esModule = true;
exports.GuildSettings = void 0;
var GuildSettings = /** @class */ (function () {
    function GuildSettings(_guildId, _botConfigChannel, _voteChannels) {
        if (_voteChannels === void 0) { _voteChannels = []; }
        console.log("Adding guild w id ".concat(_guildId));
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for (var _i = 0, _voteChannels_1 = _voteChannels; _i < _voteChannels_1.length; _i++) {
            var vc = _voteChannels_1[_i];
            this.VoteChannels.push(vc);
        }
    }
    GuildSettings.prototype.voteChannelsContains = function (channel) {
        console.log("voteChannelContains searching for ".concat(channel));
        for (var _i = 0, _a = this.VoteChannels; _i < _a.length; _i++) {
            var voteChannel = _a[_i];
            console.log("Testing against ".concat(voteChannel.channel));
            if (voteChannel.channel == channel) {
                console.log("voteChannelContains did contain. Returning voteChannel");
                return voteChannel;
            }
        }
        console.log("voteChannelContains did not contain. Returning null");
        return null;
    };
    GuildSettings.prototype.SetVoteChannel = function (voteChannel) {
        var _voteChannel = this.voteChannelsContains(voteChannel.channel);
        if (_voteChannel != null) {
            _voteChannel.emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
    };
    GuildSettings.prototype.SetConfigChannel = function (configChannel) {
        this.botConfigChannel = configChannel;
    };
    return GuildSettings;
}());
exports.GuildSettings = GuildSettings;
