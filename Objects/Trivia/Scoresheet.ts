class Scoresheet
{
    username: string;
    pointList: Array<[string, number]>;

    constructor(_username)
    {
        this.username = _username;
        this.pointList = [];
    }

    AddPoint(pointName: string, qty: number = 1)
    {
        for(var index in this.pointList)
        {
            if(this.pointList[index][0] == pointName)
            {
                this.pointList[index][1] += qty;
                return;
            }
        }
        this.pointList.push([pointName, qty]);
    }
}