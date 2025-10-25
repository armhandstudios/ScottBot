"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = void 0;
class GuildSettings {
    constructor(_guildId, _botConfigChannel, _voteChannels = [], _channelDefaults = []) {
        console.log(`Adding guild w id ${_guildId}`);
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for (var vc of _voteChannels) {
            this.VoteChannels.push(vc); //why am I doing it this way??
        }
        this.defaultChannelNames = _channelDefaults;
    }
    voteChannelsContains(channel) {
        console.log(`voteChannelContains searching for ${channel}`);
        for (var voteChannel of this.VoteChannels) {
            console.log(`Testing ${channel} against ${voteChannel.channel.slice(2, -1)}`);
            if (voteChannel.channel.slice(2, -1) === channel) { //need the slice because it reads the value as <#dlfkgjdlg>, but is testing for dlkfjsldk
                console.log(`voteChannelContains did contain. Returning voteChannel`);
                return voteChannel;
            }
        }
        console.log(`voteChannelContains did not contain. Returning null`);
        return null;
    }
    SetVoteChannel(voteChannel) {
        console.log(`In SetVoteChannel`);
        var _voteChannel = this.voteChannelsContains(voteChannel.channel);
        if (_voteChannel != null) {
            console.log(`overwriting emoji for voteChannel ${voteChannel.channel}`);
            _voteChannel.emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
        console.log(`leaving setvotechannel`);
    }
    //TODO: Implement
    RemoveVoteChannel(voteChannel) {
        this.VoteChannels = this.VoteChannels.filter(vc => (vc.channel != voteChannel.channel || vc.emoji != voteChannel.emoji));
    }
    ClearVoteChannel(channel) {
        this.VoteChannels = this.VoteChannels.filter(vc => vc.channel != channel);
    }
    //Retrieve channel defaults from guild
    GetChannelDefaults(channelDefault) {
        for (var dcn of this.defaultChannelNames) {
            if (channelDefault.channel === dcn.channel) {
                return dcn;
            }
        }
        return null;
    }
    //Update existing channel default, or add a new one
    AddChannelDefault(channelDefault) {
        var existingDefaults = this.GetChannelDefaults(channelDefault);
        if (existingDefaults == null) {
            this.defaultChannelNames.push(channelDefault);
        }
        else
            existingDefaults = channelDefault;
    }
    RemoveChannelDefault(channelName) {
        this.defaultChannelNames = this.defaultChannelNames.filter(x => x.channel != channelName);
    }
    //Designate configChannel as the bot config channel
    SetConfigChannel(configChannel) {
        this.botConfigChannel = configChannel;
    }
}
exports.GuildSettings = GuildSettings;
//# sourceMappingURL=GuildSettings.js.map