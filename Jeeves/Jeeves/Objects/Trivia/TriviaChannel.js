/// <reference path="Scoresheet.ts" />
var Jeeves;
(function (Jeeves) {
    var Objects;
    (function (Objects) {
        var Trivia;
        (function (Trivia) {
            class TriviaChannel {
                constructor(_channel) {
                    this.channel = _channel;
                    this.scoreboard = [];
                }
                DisplayScoreboard() {
                    return "i have not designed a scoreboard yet, go birds!";
                }
                GetScoresheet(username) {
                    var getSheet = this.scoreboard.find(sheet => sheet.username == username);
                    if (getSheet == null) {
                        getSheet = new Trivia.Scoresheet(username);
                        this.scoreboard.push(getSheet);
                    }
                    return getSheet;
                }
            }
            Trivia.TriviaChannel = TriviaChannel;
        })(Trivia = Objects.Trivia || (Objects.Trivia = {}));
    })(Objects = Jeeves.Objects || (Jeeves.Objects = {}));
})(Jeeves || (Jeeves = {}));
//# sourceMappingURL=TriviaChannel.js.map