"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColorRolesIfNotExist = exports.logConfig = exports.addReactionResponseToList = exports.exportGuildSettings = exports.roleColorList = exports.guildSettings = void 0;
process.stdout.write("Starting Jeeves");
/// <reference path="Objects/GuildSettings.ts" />
/// <reference path="Objects/VoteChannel.ts" />
/// <reference path="ConfigHandlers/ConfigHandler.ts" />
//TODO
//Remove Vote Channel
//Clear Vote Channels
//Remove BotConfig channel
//Get Random Pinned Message?
//Pause/Resume master commands to freeze chats
const discord_js_1 = require("discord.js");
const GuildSettings_1 = require("./Objects/GuildSettings");
const VoteChannel_1 = require("./Objects/VoteChannel");
const ConfigHandler_1 = require("./MessageHandlers/ConfigHandler");
const guildSettings_json_1 = __importDefault(require("./guildSettings.json"));
const RegexHandler_1 = require("./MessageHandlers/RegexHandler");
const RoleHandler_1 = require("./MessageHandlers/RoleHandler");
const ActivityHandler_1 = require("./MessageHandlers/ActivityHandler");
//Bot/Library vars
const token = () => {
    let x;
    try {
        x = require("./token.json"); //comment this out for commit
    }
    catch (e) {
        x = undefined;
    }
    return x;
};
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const { Console } = require("console");
const reactResponseFileName = "./reactionResponses.json";
var reactionResponses;
const bot = new Discord.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildPresences, discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.DirectMessages],
    partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message]
});
exports.guildSettings = [];
exports.roleColorList = ["White", "Aqua", "Green", "Blue", "Yellow", "Purple", "LuminousVividPink", "Fuchsia", "Gold",
    "Orange", "Red", "Grey", "Navy", "DarkAqua", "DarkGreen", "DarkBlue", "DarkPurple", "DarkVividPink", "DarkGold", "DarkOrange",
    "DarkRed", "DarkGrey", "DarkerGrey", "LightGrey", "DarkNavy", "Blurple", "Greyple", "DarkButNotBlack", "NotQuiteBlack"];
///
/// inGuildList: Checks if targetGuild is in the provided guildList
///
function inGuildList(guildList, targetGuild) {
    for (var guild of guildList) {
        if (guild.guildId === targetGuild.id) {
            return true;
        }
    }
    return false;
}
///
///getGuildInGuildList: Gets GuildSettings object from GuildList provided, using the targetGuildId
///
function getGuildInGuildList(guildList, targetGuildId) {
    for (var guild of guildList) {
        //console.log(`In getguildinlist, guild = ${guild}`);
        //console.log(guild.guildId + " / " + targetGuildId);
        if (guild.guildId === targetGuildId) {
            //console.log(`Found guild ${targetGuildId} in guild list`);
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
    fs.writeFile("guildSettings.json", guildListJSON, (err) => { if (err)
        console.log(`Error writing to guildListJSON: ${err}`); });
    logConfig("exportGuildSettings");
}
exports.exportGuildSettings = exportGuildSettings;
function loadReactResponses() {
    var rawData;
    if (fs.existsSync(reactResponseFileName)) {
        rawData = fs.readFileSync(reactResponseFileName);
        reactionResponses = JSON.parse(rawData);
    }
    else {
        reactionResponses = [];
    }
}
function saveReactResponses() {
    var reactResponsesJson = JSON.stringify(reactionResponses);
    fs.writeFile(reactResponseFileName, reactResponsesJson, (err) => { if (err)
        console.log(`Error writing to reaction responses file: ${err}`); });
}
//Add a reaction response to list of canned responses when Jeeves is @'ed
function addReactionResponseToList(newReactionResponse) {
    reactionResponses.push(newReactionResponse);
    saveReactResponses();
}
exports.addReactionResponseToList = addReactionResponseToList;
//export function GetGuild() {
//    return new Guild.
//    }
//export function GetChannelByName(guildId: string, channelName: string) {
//    return
//}
//Log bot config to console
function logConfig(source) {
    console.log("Logging config from ", source);
    console.log("Guild Settings list:");
    console.log("-------------------");
    console.log(exports.guildSettings);
    console.log("\nGuild Settings json:");
    console.log("-------------------");
    fs.readFile("./guildSettings.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("Couldn't read json; ", err);
            return;
        }
        console.log(jsonString);
    });
}
exports.logConfig = logConfig;
//Create a role 'jeeves_[color] for each possible color 
function createColorRolesIfNotExist(guild) {
    for (var color of exports.roleColorList) {
        if (guild.roles.cache.find(role => role.name == `jeeves_${color}`) == undefined) { //TODO - check that the role is the right color
            guild.roles.create({ name: `jeeves_${color}`, color: color });
        }
    }
}
exports.createColorRolesIfNotExist = createColorRolesIfNotExist;
//occurs when bot hits "ready" state
bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Try !addReactionResponse");
    if (guildSettings_json_1.default.length > 0) {
        //Read through each guild in json, and initialize a guild object for each
        for (var gs of guildSettings_json_1.default) {
            console.log(`Printing gs: ${gs}: ${gs[0]}`);
            var vcs = [];
            //build list of vote channels for given guild
            for (var vc of gs.VoteChannels) {
                console.log(`Building vote channels: Current vc: ${vc}, channel: ${vc.channel}, emoji: ${vc.emoji}`);
                let newVc = new VoteChannel_1.VoteChannel(vc.channel, vc.emoji);
                vcs.push(newVc);
            }
            //create a guild object and push it to guildSettings
            console.log(`Pushing existing guild (from json). id: ${gs.guildId}, vcs: ${vcs}`);
            exports.guildSettings.push(new GuildSettings_1.GuildSettings(gs.guildId, gs.botConfigChannel, vcs));
        }
    }
    //if bot is in a guild that isn't defined in guildSettingsJson, create a new guildSettings for it
    bot.guilds.fetch().then(guilds => guilds.each(guild => {
        if (!inGuildList(exports.guildSettings, guild)) {
            console.log("Pushing new guild (not json)");
            exports.guildSettings.push(new GuildSettings_1.GuildSettings(guild.id));
        }
    }));
    //save guildSettings
    exportGuildSettings(exports.guildSettings);
    //load reactResponses
    loadReactResponses();
});
//when a user joins
bot.on("guildMemberAdd", member => {
    console.log(`In Guild Member Add, target guild id = ${member.guild.id}`);
    var memberGuild = getGuildInGuildList(exports.guildSettings, member.guild.id);
    if (memberGuild == null)
        return;
    //If a botconfig channel is designated, post a welcome message in that channel
    if (memberGuild.botConfigChannel != null) {
        console.log("New member, bot config channel set");
        member.guild.channels.fetch(memberGuild.botConfigChannel).then(fetched => fetched.send(`Welcome, ${member}. Ohio!`));
    }
});
//when a user leaves
bot.on("guildMemberRemove", member => {
    console.log(`In Guild Member Remove, target guild id = ${member.guild.id}`);
    var memberGuild = getGuildInGuildList(exports.guildSettings, member.guild.id);
    if (memberGuild == null)
        return;
    //If a botconfig channel is designated, post a message showing who left
    if (memberGuild.botConfigChannel != null) {
        console.log("Ex member, bot config channel set");
        member.guild.channels.fetch(memberGuild.botConfigChannel).then(fetched => fetched.send(`${member} (${member.displayName}) left. We'll come back for you!!`));
    }
});
//when the bot gets a message notification
bot.on(discord_js_1.Events.MessageCreate, async (message) => {
    console.log("----------------------------------------");
    //don't respond to bots
    if (message.author.bot)
        return;
    let tradPrefix = botconfig.tradPrefix; //traditional command prefix
    let casPrefix = botconfig.casPrefix; //casual command prefix
    let casQualifier = botconfig.casQualifier; //casual command prefix is 2 words, this will be a second check.
    let messageArray = message.content.split(" ");
    let msgGuildSettings = getGuildInGuildList(exports.guildSettings, message.guild?.id);
    //split the message into command and arguments
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    //DEBUG: log message
    console.log(message.content);
    //////////////////////
    //Put DM commands here
    //////////////////////
    if (message.channel.type.toString().toLowerCase() === "dm") {
        console.log("Got DM");
        if (cmd.toLowerCase() === `${tradPrefix}addreactionresponse`) {
            console.log("ReactionResponse DM");
            var reactionResponseJoined = args.join(' ');
            addReactionResponseToList(reactionResponseJoined);
            message.reply("Successfully added message to list: " + reactionResponseJoined);
            return;
        }
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
    //Put PASSIVE commands here
    ///////////////////////////
    if (new RegexHandler_1.RegexHandler().ingest(messageArray, message)) {
        return;
    }
    //upvote channel passive effect
    var voteChannel = msgGuildSettings?.voteChannelsContains(message.channel.id);
    console.log(`Vote Channel = ${voteChannel}`);
    if (voteChannel != null) {
        console.log("This is a vote channel. Checking for attachments");
        try {
            if (message.attachments.size > 0 || message.content.includes("https://") || message.content.includes("http://")) {
                console.log("reacting with " + voteChannel.emoji);
                message.react(voteChannel.emoji)
                    .catch();
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }
    /////////////////////////////////
    //Place CONFIG commands down here
    /////////////////////////////////
    if (new ConfigHandler_1.ConfigHandler().ingest(messageArray, message)) {
        return;
    }
    //////////////////////////////////////
    //Place TRADITIONAL commands down here
    //////////////////////////////////////
    if (new RoleHandler_1.RoleHandler().ingest(messageArray, message)) {
        return;
    }
    //If message starts with @Jeeves
    if (cmd === `<@506144323708911617>`) {
        if (reactionResponses.length > 0) {
            var randomReactionResponse = reactionResponses[Math.floor(Math.random() * reactionResponses.length)];
            message.reply(randomReactionResponse);
        }
    }
    //help
    if (cmd === `${tradPrefix}help`) {
        console.log("Displaying Help");
        //TODO: Implement this
        //help with specific command
        if (args.length === 1) {
            switch (args[0]) {
                default:
                    message.channel.send("Yeah its a pain to do a specific help dialog for each command I always get mad when things don't have this but deal.");
                    return;
            }
        }
        //help general
        else {
            let helpembed = new Discord.EmbedBuilder()
                .setDescription("Available Commands: (This list is incomplete and incorrect)")
                .setColor("#CC7F3A")
                .addFields({ name: "!help", value: "Show this message" }, { name: "!setBotConfig", value: "Designates a channel as the bot config channel. This is required to get server join/leave messages" }, { name: "!setUpvote #channel [emoji]", value: "Designates a channel to be an upvote channel, where Jeeves reacts to every attachment with the specified emoji to start an upvote. Default is thumbs up" }, { name: "!setDefaultName #channel [defaultChannelName]", value: "Sets the default name of a channel to the given value. If no value is given, it will set the default channel name to its current name. To be used with !revertChannelNames" }, { name: "!revertChannelNames", value: "Reverts all channel names with a default value to their default value. See !setDefaultName" }, { name: "!poll [question]", value: "Reacts to your question with a yes no and meh option for people to vote on. You can also specify custom options by placing emojis before the question, separated by spaces!" }, { name: "!getServerConfig", value: "Prints a json object containing the configuration for the current server. May be confusing!" }, { name: "!setColor", value: "Allows you to select the color of your name! Type the command for a list of colors, then type !setColor {color} (please use designated channel)." }, { name: "!addReactionResponse", value: "Allows you to add a response to the list of responses Jeeves can have when you @ him" }, { name: "@Jeeves", value: "When @'ed, Jeeves will respond with a randomly chosen canned response" }, { name: "Passive Commands", value: "This bot may also contain some passive triggers when it sees messages with certain words" }, { name: "For More:", value: "visit https://github.com/armhandstudios/ScottBot" });
            message.channel.send({ embeds: [helpembed] });
            return;
        }
    }
    //Get settings for the guild this message was posted in
    if (cmd.toLowerCase() == `${tradPrefix}getserverconfig`) {
        console.log(`"Printing server config for ${message.guild.id}`);
        message.channel.send(JSON.stringify(msgGuildSettings));
        return;
    }
    //addrole [name] [color]
    //fuuuuuuuck ok theres error handling but these trash methods don't seem to throw errors
    //so invalid colors will just default
    if (cmd.toLowerCase() === `${tradPrefix}addrole`) {
        var roleColor;
        //check how many args there are
        if (args.length === 0) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        //set color if necessary
        if (args.length > 1) {
            roleColor = args[1];
            message.guild.roles.create({ name: args[0], color: roleColor })
                .then(() => { message.channel.send(`${args[0]} role created.`); })
                .catch(error => {
                message.channel.send("There was an error creating the role.");
                console.log(error);
            });
            return;
        }
        //just the rolename
        message.guild.roles.create({ name: args[0] })
            .then(() => { message.channel.send(`${args[0]} role created.`); })
            .catch(error => {
            message.channel.send("There was an error creating the role.");
            console.log(error);
        });
        return;
    }
    //delrole [name]
    //Leaving this as a todo. need to make sure it only deletes ones Jeeves created. prolly gonna have to leave this til its ready to go live.
    //poll
    //Reacts to a command with a thumbs up and thumbs down
    //TODO: Crashes if bot has permission to view a channel, but not permission to react in a channel
    if (cmd.toLowerCase() === `${tradPrefix}poll`) {
        let reactionsList = [];
        for (let reaction of args) {
            console.log("Parsing args for reactions; found ", reaction);
            let emojiMatch = message.guild.emojis.cache.find(emoji => emoji.toString() === reaction);
            if (emojiMatch != undefined) {
                console.log("Pushing custom emoji ", emojiMatch.name);
                reactionsList.push(emojiMatch);
            }
            else {
                if (/\p{Emoji}/u.test(reaction)) {
                    console.log("Pushing non custom emoji ", reaction);
                    reactionsList.push(reaction);
                }
                else {
                    console.log("Found non-emoji; breaking. ", reaction);
                    break;
                }
            }
            ;
        }
        if (reactionsList.length == 0) {
            message.react('👍').then(() => message.react('🤷')).then(() => message.react('👎')).catch();
        }
        else {
            let chain = undefined;
            for (let reaction of reactionsList) {
                if (chain == undefined) {
                    chain = message.react(reaction);
                }
                else {
                    chain = chain.then(() => message.react(reaction));
                }
            }
            chain.catch();
        }
    }
    if (new ActivityHandler_1.ActivityHandler().ingest(messageArray, message)) {
        return;
    }
});
if (token() == null) {
    console.log("using environment var");
    bot.login(process.env.discordToken);
}
else {
    console.log(token());
    bot.login(token().token);
}
process.on("uncaughtException", (reason, p) => {
    console.error(reason, "Uncaught Exception at Promise", p);
    process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
    process.exit(1);
});
//# sourceMappingURL=app.js.map