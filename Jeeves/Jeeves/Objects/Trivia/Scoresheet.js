var Jeeves;
(function (Jeeves) {
    var Objects;
    (function (Objects) {
        var Trivia;
        (function (Trivia) {
            class Scoresheet {
                constructor(_username) {
                    this.username = _username;
                    this.pointList = [];
                }
                AddPoint(pointName, qty = 1) {
                    for (var index in this.pointList) {
                        if (this.pointList[index][0] == pointName) {
                            this.pointList[index][1] += qty;
                            return;
                        }
                    }
                    this.pointList.push([pointName, qty]);
                }
            }
            Trivia.Scoresheet = Scoresheet;
        })(Trivia = Objects.Trivia || (Objects.Trivia = {}));
    })(Objects = Jeeves.Objects || (Jeeves.Objects = {}));
})(Jeeves || (Jeeves = {}));
//# sourceMappingURL=Scoresheet.js.map