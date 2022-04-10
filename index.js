"use strict";
//Discord bot
//The end goal of this project is to create a bot to moderate a server with useful features.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//random todos:
//wanna refactor out the whole cmd is the first word and args are the rest, just work with the whole word array rather than splitting it up
//command to lock help commands to a specific channel. if i do this, then will need to track for channel changes to the server.
//make bot accept all friend requests for users privacy reasons
//Bot/Library vars
var token = function () {
    var x;
    try {
        x = require("./token.json"); //comment this out for commit
    }
    catch (e) {
        x = null;
    }
    return x;
};
var botconfig = require("./botconfig.json");
var Discord = require("discord.js");
var fs = require("fs");
var Console = require("console").Console;
var bot = new Discord.Client({});
//
//Instantiate command relevant variables below
//
var guildSettings = [];
//All this is being obsoleted. Need to find a way to create config file for each server for each new feature added.
//Saving code to make it easier to reintroduce features
//Gaslight vars 
//var gaslit = null;
//var glTimeout = null;
//Secret Santa vars
//var isSSactive = false;
//var SSDesc = "";
//var SSPlayerList = [];
//var SSTargetList = [];
//var SSGiftList = [];
//troint stuff
//var oldHours = 0;
//var playersList = []
//var currentAnswer = ""
//var questionsList = [];
var GuildSettings = /** @class */ (function () {
    function GuildSettings(_guildId, _botConfigChannel, _voteChannels) {
        if (_botConfigChannel === void 0) { _botConfigChannel = null; }
        if (_voteChannels === void 0) { _voteChannels = []; }
        console.log("Adding guild w id " + _guildId);
        this.guildId = _guildId;
        this.botConfigChannel = _botConfigChannel;
        this.VoteChannels = [];
        for (var _i = 0, _voteChannels_1 = _voteChannels; _i < _voteChannels_1.length; _i++) {
            var vc = _voteChannels_1[_i];
            this.VoteChannels.push(vc);
        }
    }
    GuildSettings.prototype.voteChannelsContains = function (channel) {
        for (var _i = 0, _a = this.VoteChannels; _i < _a.length; _i++) {
            var voteChannel = _a[_i];
            if (voteChannel.channel == channel) {
                return voteChannel;
            }
        }
        return null;
    };
    GuildSettings.prototype.SetVoteChannel = function (voteChannel) {
        if (this.voteChannelsContains(voteChannel.channel) != null) {
            this.voteChannelsContains(voteChannel.channel).emoji = voteChannel.emoji;
            return;
        }
        this.VoteChannels.push(voteChannel);
    };
    GuildSettings.prototype.SetConfigChannel = function (configChannel) {
        this.botConfigChannel = configChannel;
    };
    GuildSettings.prototype.SetTriviaChannel = function (triviaChannel) {
        if (this.TriviaChannels.find(function (channel) { return channel.channel === triviaChannel; }) != null) {
            return;
        }
        this.TriviaChannels.push(new TriviaChannel(triviaChannel));
    };
    return GuildSettings;
}());
var VoteChannel = /** @class */ (function () {
    function VoteChannel(_channel, _emoji) {
        this.channel = _channel; //channel's ID
        this.emoji = _emoji; //emoji to react with
    }
    return VoteChannel;
}());
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
/**
class CharacterSheet
{
    constructor(username)
    {
        this.name = username;
        this.health = 10;
        this.attack = 1;
        this.attackBonus = 0;
        this.inventory = []
    }

    //will need a way to serialize this object

    getHealth()
    {
        return this.health;
    }

    getAttackPower()
    {
        return this.attack + this.attackBonus;
    }

}

function getCharSheetByName(charList, un)
{
    console.log(`looking for ${un}`);
    for(cs in charList)
    {
        console.log(charList[cs]);
        if(charList[cs].name == un)
        {
            console.log("found");
            return charList[cs];
        }
    }
    return null
}

function randomDrop(charSheet)
{
    var num = Math.random();
    if(num < .05)
    {
        return "Troint";
    }
    if(num < .20)
    {
        if(charSheet.health < 10)
        {
            charSheet.health += 1;
        }
        return "Health Pack (+1hp)";
    }
    if(num < .35)
    {
        if(charSheet.health < 9)
        {
            charSheet.health += 2;
        }
        else
        {
            charSheet.health = 10;
        }
        return "Health Pack (+2hp)";
    }
    if (num < .4375)
    {
        charSheet.attackBonus = 1;
        return "Knife (+1atk)";
    }
    if (num < .5250)
    {
        charSheet.attackBonus = 1;
        return "Saw (+1atk)";
    }
    if (num < .6125)
    {
        charSheet.attackBonus = 1;
        return "Dagger (+1atk)";
    }
    if (num < .70)
    {
        charSheet.attackBonus = 1;
        return "Shank (+1atk)";
    }
    if (num < .775)
    {
        charSheet.attackBonus = 2;
        return "Machete (+2atk)";
    }
    if (num < .85)
    {
        charSheet.attackBonus = 2;
        return "Iron Rod (+2atk)";
    }
    if (num < .925)
    {
        charSheet.attackBonus = 2;
        return "Sickle (+2atk)";
    }
    if (num < 1)
    {
        charSheet.attackBonus = 2;
        return "Bow and Arrow (+2atk)";
    }
}
*/
function inGuildList(guildList, targetGuild) {
    for (var _i = 0, guildList_1 = guildList; _i < guildList_1.length; _i++) {
        var guild = guildList_1[_i];
        if (guild.guildId === targetGuild.id) {
            return true;
        }
    }
    return false;
}
//gets guildSettings from guildSettings list
function getGuildInGuildList(guildList, targetGuildId) {
    for (var _i = 0, guildList_2 = guildList; _i < guildList_2.length; _i++) {
        var guild = guildList_2[_i];
        console.log("In getguildinlist, guild = " + guild);
        console.log(guild.guildId + " / " + targetGuildId);
        if (guild.guildId === targetGuildId) {
            console.log("Found guild " + targetGuildId + " in guild list");
            return guild;
        }
    }
    return null;
}
function sanitizeChannelReference(channelReference) {
    return channelReference.substring(2, channelReference.length - 1);
}
function exportGuildSettings(guildSettingsList) {
    var guildListJSON = JSON.stringify(guildSettingsList);
    fs.writeFile("guildSettings.json", guildListJSON, function (err) { if (err)
        console.log("Error writing to guildListJSON: " + err); });
}
//occurs when bot hits "ready" state
bot.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var guildSettingsList, _i, guildSettingsList_1, gs, vcs, _a, _b, vc;
    return __generator(this, function (_c) {
        console.log(bot.user.username + " is online!");
        bot.user.setActivity("The troints will matter");
        guildSettingsList = null;
        //fs.readFile("guildSettings.json", "utf-8", function(err, data){if(err) throw err; 
        //    guildSettingsList = JSON.parse(data); 
        //    console.log(`Printing guild settings list: ${guildSettingsList}`);});
        guildSettingsList = JSON.parse(fs.readFileSync("guildSettings.json", "utf-8"));
        console.log("Printing guild settings list: " + guildSettingsList);
        if (guildSettingsList != null) {
            for (_i = 0, guildSettingsList_1 = guildSettingsList; _i < guildSettingsList_1.length; _i++) {
                gs = guildSettingsList_1[_i];
                console.log("Printing gs: " + gs + ": " + gs[0]);
                vcs = [];
                for (_a = 0, _b = gs.VoteChannels; _a < _b.length; _a++) {
                    vc = _b[_a];
                    console.log("Building vote channels: Current vc: " + vc + ", channel: " + vc.channel + ", emoji: " + vc.emoji);
                    vcs.push(new VoteChannel(vc.channel, vc.emoji));
                }
                //may need to make this constructor
                console.log("Pushing existing guild (from json). id: " + gs.guildId + ", vcs: " + vcs);
                guildSettings.push(new GuildSettings(gs.guildId, gs.botConfigChannel, vcs));
            }
        }
        bot.guilds.map(function (guild) {
            if (!inGuildList(guildSettings, guild)) {
                console.log("Pushing new guild (not json)");
                guildSettings.push(new GuildSettings(guild.id));
            }
        });
        exportGuildSettings(guildSettings);
        return [2 /*return*/];
    });
}); });
//should make these commands send embeds
//when a user joins
bot.on("guildMemberAdd", function (member) {
    console.log("In Guild Member Add, target guild id = " + member.guild.id);
    var memberGuild = getGuildInGuildList(guildSettings, member.guild.id);
    if (memberGuild.botConfigChannel != null) {
        console.log("New member, bot config channel set");
        member.guild.channels.get(memberGuild.botConfigChannel).send("Welcome, " + member + ". Ohio!");
    }
});
//when a user leaves
bot.on("guildMemberRemove", function (member) {
    console.log("In Guild Member Add, target guild id = " + member.guild.id);
    var memberGuild = getGuildInGuildList(guildSettings, member.guild.id);
    if (memberGuild.botConfigChannel != null) {
        console.log("Ex member, bot config channel set");
        member.guild.channels.get(memberGuild.botConfigChannel).send(member + " (" + member.displayName + ") left. We'll come back for you!!");
    }
});
bot.on("presenceUpdate", function (oldMember, newMember) {
    //this is a hacky way to check a random chance every so often. it assumes someone in the server will change presence at least once an hour.
    //that wakes this command up and it will check if its a new hour and a valid hour and will run the check
    //var h = new Date().getHours();
    //if(h != oldHours && h >= 12 && h < 22)
    //    {
    //        oldHours = h;
    //        if(Math.random() < .3)
    //        {
    //            if(questionsList.length > 0)
    //            {
    //                var curQuestion = Math.floor(Math.random() * questionsList.length);
    //                console.log(questionsList[curQuestion][0]);
    //                console.log(questionsList[curQuestion][1]);
    //               bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`An airtrop has appeared: ${questionsList[curQuestion][0]}`);
    //                currentAnswer = questionsList[curQuestion][1];
    //                questionsList.splice(curQuestion, 1);
    //            }
    //        }
    //   }
});
//when the bot gets a message notification
bot.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var tradPrefix, casPrefix, casQualifier, messageArray, cmd, args, word, _i, messageArray_1, word, msgGuildSettings, voteChannel, i, emoji, upvoteChannel, configChannel, helpembed, roleColor;
    return __generator(this, function (_a) {
        console.log("----------------------------------------");
        //don't respond to bots
        if (message.author.bot)
            return [2 /*return*/];
        tradPrefix = botconfig.tradPrefix;
        casPrefix = botconfig.casPrefix;
        casQualifier = botconfig.casQualifier //casual command prefix is 2 words, this will be a second check.
        ;
        messageArray = message.content.split(" ");
        cmd = messageArray[0];
        args = messageArray.slice(1);
        //////////////////////
        //Put DM commands here
        //////////////////////
        if (message.channel.type === "dm") {
            //Need to generalize this process for multiple servers. May move it out of DMs and into a specific channel, bu i think dms is good
            //if(cmd == "addq")
            //{
            //    if(!messageArray.includes("|"))
            //    {
            //        message.channel.send("Invalid format");
            //        return;
            //    }
            //   var newQuestion = message.content.slice(5).split(" | ");
            //   console.log(`Adding ${newQuestion[0]}, ${newQuestion[1]}.`)
            //    questionsList.push(newQuestion);
            //    console.log(questionsList);
            //}
            //if(cmd == "listq")
            //{
            //    message.channel.send(`List of Questions: ${questionsList}`);
            //}
            //if(cmd == "setwp")
            //{
            //    console.log(getCharSheetByName(playersList, message.content.slice(6)));
            //    getCharSheetByName(playersList, message.content.slice(6)).attackBonus = 3;
            //}
            //if(cmd == "setwp2")
            //{
            //    console.log(getCharSheetByName(playersList, message.content.slice(7)));
            //    getCharSheetByName(playersList, message.content.slice(7)).attackBonus = 2;
            //}
            //if(cmd == "setwp1")
            //{
            //    console.log(getCharSheetByName(playersList, message.content.slice(7)));
            //    getCharSheetByName(playersList, message.content.slice(7)).attackBonus = 1;
            //}
            //if(cmd == "sethp")
            //{
            //    console.log(getCharSheetByName(playersList, message.content.slice(9)));
            //    console.log(messageArray[1]);
            //    getCharSheetByName(playersList, message.content.slice(9)).health = parseInt(messageArray[1]);
            //    console.log(getCharSheetByName(playersList, message.content.slice(9)).health = parseInt(messageArray[1]));
            //}
            //if(cmd == "forceq")
            //{
            //    if(questionsList.length > 0)
            //        {
            //            var curQuestion = Math.floor(Math.random() * questionsList.length);
            //            console.log(questionsList[curQuestion][0]);
            //            console.log(questionsList[curQuestion][1]);
            //            bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`An airtrop has appeared: ${questionsList[curQuestion][0]}`);
            //            currentAnswer = questionsList[curQuestion][1];
            //            questionsList.splice(curQuestion, 1);
            //        }
            //}
            //rvv The Resistance | Message
            //if(cmd == "rvv")
            //{
            //    console.log("Start revive");
            //    var trontestantRole = bot.guilds.get("263039543048011778").roles.get("701974929804886056");
            //    if(!messageArray.includes("|"))
            //    {
            //        message.channel.send("Invalid format");
            //        return;
            //    }
            //    var revUsername = message.content.slice(4).split(" | ")[0];
            //    var revMsg = message.content.slice(4).split(" | ")[1];
            //    var revCs = getCharSheetByName(revUsername);
            //    if(revCs == null)
            //    {
            //        console.log(`Adding ${revUsername}`);
            //        revCs = new CharacterSheet(revUsername);
            //        playersList.push(revCs);
            //        console.log(`New pl after rev: ${playersList}`);
            //    }
            //    revCs.health = 10;
            //    bot.guilds.get("263039543048011778").members.map(member =>
            //        {
            //            console.log(member.user.username);
            //            if(member.user.username == revUsername)
            //            {
            //                console.log(revUsername);
            //                member.addRole(trontestantRole);
            //                bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`${revUsername} has been revived: ${revMsg}`);
            //            }
            //        });
            //}
            //secretSanta
            //commenting out secret santa because it shares variables across guilds. need to isolate that
            //if(cmd === `${tradPrefix}secretSanta`)
            //{
            //secretSanta submit
            //    if(args[0] === "submit")
            //    {
            //make sure the player is in secret santa
            //        if(!message.author in SSPlayerList)
            //        {
            //            message.channel.send("You are not registered for the current Secret Santa session.");
            //            return;
            //        }
            //make sure there is a message
            //        if(args.length === 1)
            //        {
            //            message.channel.send("Please use !secretSanta submit [message that includes the gift code/link].");
            //            return;
            //        }
            //record the message in the appropriate spot of gifts list
            //        var PlayerIndex = SSPlayerList.indexOf(message.author);                 //Find the index in playerList of the person who sent this message
            //        var TargetIndex = SSPlayerList.indexOf(SSTargetList[PlayerIndex]);      //Find the index in playerList of the target of the person who sent this message
            //        SSGiftList[TargetIndex] = args.slice(1).join(" ");
            //        message.channel.send(`Your gift has been recieved and will be sent to ${targetPlayerIndex} when this ends.`);
            //        return;
            //    }
            //}
        }
        ///////////////////////////
        //Put TROINTS commands here
        ///////////////////////////
        //Tranctum legacy
        //if(message.channel.id == "697672130510192711")
        //{
        //    if(currentAnswer != "" && message.content.toLowerCase().includes(currentAnswer.toLowerCase()))
        //    {
        //        var drop = randomDrop(getCharSheetByName(playersList, message.author.username));
        //        message.channel.send(`BING BONG. ${message.author.username} gets a ${drop}!`);
        //        console.log(`${message.author.username} gets the drop!`);
        //        currentAnswer = "";
        //    }
        //    if(cmd == "!health")
        //    {
        //        message.channel.send(`You have ${getCharSheetByName(playersList, message.author.username).health} health left.`);
        //    }
        //    if(cmd == "!attack")
        //    {
        //        console.log("Trying to attack");
        //        var trontestantRole = message.guild.roles.get("701974929804886056");
        //        if(message.mentions.members.size > 0 && !message.mentions.everyone)
        //        {
        //            var victim = message.mentions.members.first();
        //            var returnString = `You attempt to attack ${victim.displayName}. `;
        //            console.log("Found victim");
        //            console.log()
        //            if(Math.random() < .55)
        //            {
        //hit
        //                console.log(getCharSheetByName(playersList, victim.user.username).name);
        //                getCharSheetByName(playersList, victim.user.username).health -= getCharSheetByName(playersList, message.author.username).getAttackPower();
        //                returnString += `You hit dealing ${getCharSheetByName(playersList, message.author.username).getAttackPower()} damage (${getCharSheetByName(playersList, victim.user.username).health}hp left). `
        //                if(getCharSheetByName(playersList, victim.user.username).health < 1)
        //                {
        //                    returnString += "Their soul descends into the darkness...";
        //                    victim.removeRole(trontestantRole, "Try again next time on Trivia Troints!");
        //                }
        //            }
        //            else
        //            {
        //miss
        //                console.log(getCharSheetByName(playersList, victim.user.username).name);
        //                getCharSheetByName(playersList, message.author.username).health -= getCharSheetByName(playersList, victim.user.username).getAttackPower();
        //                returnString += `You miss, and get counterattacked taking ${getCharSheetByName(playersList, victim.user.username).getAttackPower()} damage (${getCharSheetByName(playersList, message.author.username).health}hp left). `
        //                if(getCharSheetByName(playersList, message.author.username).health < 1)
        //                {
        //                    returnString += "Your soul descends into the darkness...";
        //                    message.member.removeRole(trontestantRole, "Try again next time on Trivia Troints!");
        //                }
        //            }
        //            message.channel.send(returnString);
        //        }
        //    }
        //    return;
        //}
        ///////////////////////////
        //Put PASSIVE commands here
        ///////////////////////////
        //smultimash
        for (word in messageArray) //why the hecc does word give an index and not a word javascript is dumb {answered: gotta do for/of, not for/in}
         {
            if (/^sm.*u.*sh/i.test(messageArray[word])) {
                console.log("Fixing smush");
                message.channel.send("Looks like you made a typo. Lemme take care of that for you :)");
                message["delete"]()["catch"](function (O_o) { console.log("Couldn't delete?"); });
                //Todo: Send an embed saying "person x says: message but smush is replaced"
            }
        }
        if (/s.ot.?.*w.?oz.*/i.test(message.content.toLowerCase())) {
            console.log("How dare you say that name in this server");
            message["delete"]()["catch"](function (O_o) { console.log("Couldn't delete?"); });
        }
        //stonks
        for (_i = 0, messageArray_1 = messageArray; _i < messageArray_1.length; _i++) {
            word = messageArray_1[_i];
            if (word.toLowerCase() == "stocks") {
                message.channel.send("*Stonks");
                return [2 /*return*/];
            }
            if (word.toLowerCase() == "stock") {
                message.channel.send("*Stonk");
                return [2 /*return*/];
            }
        }
        msgGuildSettings = getGuildInGuildList(guildSettings, message.guild.id);
        voteChannel = msgGuildSettings === null || msgGuildSettings === void 0 ? void 0 : msgGuildSettings.voteChannelsContains(message.channel);
        console.log("Vote Channel = " + voteChannel);
        if (voteChannel != null) {
            console.log("This is a vote channel. Checking for attachments");
            if (message.attachments.size > 0 || message.content.includes("https://") || message.content.includes("http://")) {
                console.log("reacting");
                message.react(voteChannel.emoji);
            }
        }
        //gaslight passive effect
        //if(message.author === gaslit)
        //{
        //    if(message.createdAt > glTimeout)
        //    {
        //        gaslit = null;
        //        glTimeout = null;
        //        console.log("Clearing gaslight data: Timeout");
        //    }
        //    else
        //    {
        //        if(Math.random() < 0.5)
        //        {
        //            message.delete();
        //            console.log(`Deleting message ${message.content} from ${message.author}`)
        //        }
        //        else
        //        {
        //            console.log("Gaslight check failed");
        //        }
        //    }
        //}
        ////////////////////////////////////////////////////////////
        //Place CASUAL commands that the bot can say no to down here
        ////////////////////////////////////////////////////////////
        //road map for these commands
        //allow the bot to randomly say yes or no
        //have them reply with :ok_hand: or an x emoji
        //don't allow one person to spam commands
        //verify that its a casual command
        if (cmd === "" + casPrefix) {
            if (args[0] === "" + casQualifier) {
                args = args.slice(1);
                for (i = 0; i < args.length; i++) {
                    //if(args[i] === "gaslight")
                    //{
                    //gaslight
                    //ideal syntax: hey bot, [can you] gaslight @x [...]
                    //responses: none, agreement (gaslights those people), dissent (gaslights user instead)
                    //    if(gaslit === null)
                    //    {
                    //        args = args.slice[i + 1];
                    //        var user = message.mentions.users.first()
                    //        var sender = message.author;
                    //        var decision = Math.random() * 10;
                    //        if(decision === 1)
                    //        {
                    //            gaslit = sender;
                    //            glTimeout = new Date(message.createdAt.getTime() + 60*60000);   //timeout is 60 minutes
                    //            message.react('😠');
                    //            console.log(`Gaslighting ${gaslit.username}`);
                    //            break;
                    //        }
                    //        if(decision <= 5)
                    //        {
                    //            gaslit = user;
                    //            glTimeout = new Date(message.createdAt.getTime() + 60*60000);   //timeout is 60 minutes
                    //            message.react('👌');
                    //            console.log(`Gaslighting ${gaslit.username}`);
                    //            break;
                    //        }
                    //        console.log(`Gaslighting no one`);
                    //        break;
                    //    }
                    //    else
                    //    {
                    //        console.log("Someone is already gaslit");
                    //    }
                    //}
                }
            }
        }
        /////////////////////////////////
        //Place CONFIG commands down here
        /////////////////////////////////
        if (cmd === tradPrefix + "setUpvote") {
            if (args.length < 1 || args.length > 2) {
                message.channel.send("I'm sorry old sport, I didn't understand that.");
                return [2 /*return*/];
            }
            if (args.length == 2) {
                emoji = args[1];
            }
            else {
                emoji = '👍';
            }
            upvoteChannel = new VoteChannel(args[0], emoji);
            console.log(upvoteChannel);
            guildSettings.find(function (guildSetting) { return guildSetting.guildId === message.guild.id; }).SetVoteChannel(upvoteChannel);
            exportGuildSettings(guildSettings);
        }
        if (cmd === tradPrefix + "setBotConfig") {
            if (args.length > 1) {
                message.channel.send("I'm sorry old sport, I didn't understand that.");
                return [2 /*return*/];
            }
            configChannel = null;
            console.log("Setting config channel");
            if (args.length == 1) {
                configChannel = args[0];
                console.log("Config Channel = " + configChannel);
            }
            else {
                configChannel = message.channel.id;
                console.log("Config Channel = " + configChannel);
            }
            if (configChannel != null) {
                console.log("Executing SetConfigChannel");
                guildSettings.find(function (guildSetting) { return guildSetting.guildId === message.guild.id; }).SetConfigChannel(configChannel);
            }
            exportGuildSettings(guildSettings);
        }
        //////////////////////////////////////
        //Place TRADITIONAL commands down here
        //////////////////////////////////////
        //help
        if (cmd === tradPrefix + "help") {
            console.log("Displaying Help");
            /*if(message.channel.name != botconfig.botchannel)
            {
                return message.channel.send(`${cmd} must be sent in the ${botconfig.botchannel} channel`);
            }*/
            //help with specific command
            if (args.length === 1) {
                switch (args[0]) {
                    default:
                        return [2 /*return*/, message.channel.send("Yeah its a pain to do a specific help dialog for each command I always get mad when things don't have this but deal.")];
                }
            }
            //help general
            else {
                helpembed = new Discord.RichEmbed()
                    .setDescription("Available Commands: (This list is incomplete and incorrect)")
                    .setColor("#CC7F3A")
                    .addField("!help", "Show this message")
                    .addField("!setBotConfig", "Designates a channel as the bot config channel. This is required to get server join/leave messages")
                    .addField("!setUpvote #channel [emoji]", "Designates a channel to be an upvote channel, where Jeeves reacts to every attachment with the specified emoji to start an upvote. Default is thumbs up")
                    .addField("!poll [question]", "Reacts to your question with a yes no and meh option for people to vote on")
                    .addField("Passive Commands", "This bot may also contain some passive triggers when it sees messages with certain words")
                    .addField("For More:", "visit https://github.com/armhandstudios/ScottBot");
                return [2 /*return*/, message.channel.send(helpembed)];
            }
        }
        //addrole [name] [color]
        //fuuuuuuuck ok theres error handling but these trash methods don't seem to throw errors
        //so invalid colors will just default
        if (cmd === tradPrefix + "addrole") {
            //check how many args there are
            if (args.length === 0) {
                message.channel.send("I'm sorry old sport, I didn't understand that.");
                return [2 /*return*/];
            }
            //set color if necessary
            if (args.length > 1) {
                roleColor = args[1];
                message.guild.createRole({ name: args[0], color: roleColor })
                    .then(function () { return message.channel.send(args[0] + " role created."); })["catch"](function (error) {
                    message.channel.send("There was an error creating the role.");
                    console.log(error);
                });
                return [2 /*return*/];
            }
            //just the rolename
            message.guild.createRole({ name: args[0] })
                .then(function () { return message.channel.send(args[0] + " role created."); })["catch"](function (error) {
                message.channel.send("There was an error creating the role.");
                console.log(error);
            });
            return [2 /*return*/];
        }
        //delrole [name]
        //Leaving this as a todo. need to make sure it only deletes ones its created. prolly gonna have to leave this til its ready to go live.
        //poll
        //Reacts to a command with a thumbs up and thumbs down
        if (cmd === tradPrefix + "poll") {
            message.react('👍').then(function () { return message.react('🤷').then(function () { return message.react('👎'); }); });
        }
        return [2 /*return*/];
    });
}); });
if (token() == null) {
    console.log("using environment var");
    bot.login(process.env.discordToken);
}
else {
    console.log(token());
    bot.login(token().token);
}
