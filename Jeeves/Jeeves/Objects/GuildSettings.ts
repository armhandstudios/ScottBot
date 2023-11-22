/// <reference path="VoteChannel.ts" />
import { ChannelDefaults } from "./ChannelDefaults";
import { VoteChannel } from "./VoteChannel";
import { BaseGuildTextChannel, TextChannel, BaseChannel } from "discord.js";

export class GuildSettings {
    guildId: string;
    botConfigChannel?: string;
    VoteChannels: Array<VoteChannel>;
    defaultChannelNames: Array<ChannelDefaults>

    constructor(_guildId: string, _botConfigChannel?: string, _voteChannels: Array<VoteChannel> = [], _channelDefaults: Array<ChannelDefaults> = []) {
        console.log(`Adding guild w id ${_guildId}`);
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for (var vc of _voteChannels) {
            this.VoteChannels.push(vc); //why am I doing it this way??
        }

        this.defaultChannelNames = _channelDefaults;
    }

    voteChannelsContains(channel : TextChannel): VoteChannel | null {
        console.log(`voteChannelContains searching for ${channel}`);
        for (var voteChannel of this.VoteChannels) {
            console.log(`Testing against ${voteChannel.channel}`);
            if (voteChannel.channel.slice(2, -1) == channel.id) {  //need the slice because it reads the value as <#dlfkgjdlg>, but is testing for dlkfjsldk
                console.log(`voteChannelContains did contain. Returning voteChannel`);
                return voteChannel;
            }
        }
        console.log(`voteChannelContains did not contain. Returning null`);
        return null;
    }

    SetVoteChannel(voteChannel) {
        var _voteChannel = this.voteChannelsContains(voteChannel.channel)
        if (_voteChannel != null) {
            _voteChannel.emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
    }

    channelDefaultsContains(channelDefault: ChannelDefaults): boolean {
        for (var dcn of this.defaultChannelNames) {
            if (channelDefault.channel === dcn.channel) {
                return true;
            }
        }
        return false;
    }

    AddChannelDefault(channelDefault: ChannelDefaults) {
        if (!this.channelDefaultsContains(channelDefault)) {
            this.defaultChannelNames.push(channelDefault)
        }
    }

    SetConfigChannel(configChannel) {
        this.botConfigChannel = configChannel;
    }
}
