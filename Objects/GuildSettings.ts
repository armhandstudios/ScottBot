class GuildSettings
{
    guildId: string;
    botConfigChannel?: string;
    VoteChannels: Array<VoteChannel>;
    constructor(_guildId:string, _botConfigChannel?:string, _voteChannels:Array<VoteChannel> = [])
    {
        console.log(`Adding guild w id ${_guildId}`);
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for(var vc of _voteChannels)
        {
            this.VoteChannels.push(vc);
        }
    }

    voteChannelsContains(channel) : VoteChannel | null
    {
        console.log(`voteChannelContains searching for ${channel}`);
        for(var voteChannel of this.VoteChannels)
        {
            console.log(`Testing against ${voteChannel.channel}`);
            if(voteChannel.channel == channel)
            {
                console.log(`voteChannelContains did contain. Returning voteChannel`);
                return voteChannel;
            }
        }
        console.log(`voteChannelContains did not contain. Returning null`);
        return null;
    }

    SetVoteChannel(voteChannel)
    {
        var _voteChannel = this.voteChannelsContains(voteChannel.channel)
        if(_voteChannel != null)
        {
            _voteChannel.emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
    }

    SetConfigChannel(configChannel)
    {
        this.botConfigChannel = configChannel;
    }
}
