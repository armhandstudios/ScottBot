const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () =>
{
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Yeet Skeet");
});

bot.on("message", async message => 
{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    //hello world
    if(cmd === `${prefix}hello`)
    {
        return message.channel.send("Hello!");
    }

    //help
    if(cmd === `${prefix}help`)
    {
        //help with specific command
        if(args.length === 1)
        {
            switch(args[0])
            {
                case "hello":
                    return message.channel.send("Exchange a simple greeting");
                default:
                    return message.channel.send("???");
            }
        }
        //help general
        else
        {
            return message.channel.send(`Available commands:
!hello: sends hello message`);    
        }
    }

    //vote

    //SS



});

bot.login(botconfig.token);