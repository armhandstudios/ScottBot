class TriviaChannel
{
    channel: string;
    scoreboard: Array<Scoresheet>;

    constructor(_channel: string)
    {
        this.channel = _channel;
        this.scoreboard = [];
    }

    DisplayScoreboard() : string
    {
        return "i have not designed a scoreboard yet, go birds!";
    }

    GetScoresheet(username: string) : Scoresheet
    {
        var getSheet = this.scoreboard.find(sheet => sheet.username == username);
        if(getSheet == null)
        {
            getSheet = new Scoresheet(username);
            this.scoreboard.push(getSheet);
        }
        return getSheet;

    }
}