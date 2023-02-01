"use strict";
/// <reference path="VoteChannel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = void 0;
class GuildSettings {
    constructor(_guildId, _botConfigChannel, _voteChannels = []) {
        console.log(`Adding guild w id ${_guildId}`);
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for (var vc of _voteChannels) {
            this.VoteChannels.push(vc);
        }
    }
    voteChannelsContains(channel) {
        console.log(`voteChannelContains searching for ${channel}`);
        for (var voteChannel of this.VoteChannels) {
            console.log(`Testing against ${voteChannel.channel}`);
            if (voteChannel.channel == channel) {
                console.log(`voteChannelContains did contain. Returning voteChannel`);
                return voteChannel;
            }
        }
        console.log(`voteChannelContains did not contain. Returning null`);
        return null;
    }
    SetVoteChannel(voteChannel) {
        var _voteChannel = this.voteChannelsContains(voteChannel.channel);
        if (_voteChannel != null) {
            _voteChannel.emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
    }
    SetConfigChannel(configChannel) {
        this.botConfigChannel = configChannel;
    }
}
exports.GuildSettings = GuildSettings;
//# sourceMappingURL=GuildSettings.js.map