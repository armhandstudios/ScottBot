var TriviaChannel = /** @class */ (function () {
    function TriviaChannel(_channel) {
        this.channel = _channel;
        this.scoreboard = [];
    }
    TriviaChannel.prototype.DisplayScoreboard = function () {
        return "i have not designed a scoreboard yet, go birds!";
    };
    TriviaChannel.prototype.GetScoresheet = function (username) {
        var getSheet = this.scoreboard.find(function (sheet) { return sheet.username == username; });
        if (getSheet == null) {
            getSheet = new Scoresheet(username);
            this.scoreboard.push(getSheet);
        }
        return getSheet;
    };
    return TriviaChannel;
}());
