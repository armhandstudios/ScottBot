class VoteChannel
{
    channel: string;
    emoji: string;

    constructor(_channel, _emoji)
    {
        this.channel = _channel; //channel's ID
        this.emoji = _emoji;     //emoji to react with
    }
}