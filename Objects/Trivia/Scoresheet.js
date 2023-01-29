var Scoresheet = /** @class */ (function () {
    function Scoresheet(_username) {
        this.username = _username;
        this.pointList = [];
    }
    Scoresheet.prototype.AddPoint = function (pointName, qty) {
        if (qty === void 0) { qty = 1; }
        for (var index in this.pointList) {
            if (this.pointList[index][0] == pointName) {
                this.pointList[index][1] += qty;
                return;
            }
        }
        this.pointList.push([pointName, qty]);
    };
    return Scoresheet;
}());
