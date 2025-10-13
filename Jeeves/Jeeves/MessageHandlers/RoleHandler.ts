///<reference path="../app.ts"/>

import { ColorResolvable, Message, RoleResolvable, Role } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { roleColorList, createColorRolesIfNotExist } from "../app"

export class RoleHandler extends BaseHandler {

    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray: string[], message: Message): boolean {
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);
        if (cmd === `${this.tradPrefix}setcolor`) {
            this.SetColor(args, message);
            return true;
        }

        if (cmd === `${this.tradPrefix}setupcolorroles`) {
            this.SetUpColorRoles(message);
            return true
        }
    }

    //!SetColor [color]
    //If a valid color is given, user is given role 'jeeves_[color], which should be configured as the only roles with colors in the server
    //Other jeeves_[color] roles will be removed so user only ever has one
    SetColor(args: string[], message: Message): void {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }

        //If no args are given, or arg is not a valid color, post list of valid colors
        if (args.length < 1
            || message.guild.roles.cache.find(role => role.name == `jeeves_${args[0]}`) == undefined) {
            message.channel.send(`Please say which color you want to be from the following (mind your caps) - ${roleColorList.toString()}`);
            return;
        }

        //Remove all other color roles
        var colorRoleIter: Role;
        for (var color of roleColorList) {
            if (color != args[0]) {
                colorRoleIter = message.member.roles.cache.find(r => r.name == `jeeves_${color}`)
                message.member.roles.remove(colorRoleIter).catch(_ => null);
            }
        }

        //Add requested role to user
        message.member.roles.add(message.guild.roles.cache.find(role => role.name == `jeeves_${args[0]}`));
    }

    SetUpColorRoles(message: Message): void {

        //Set all non jeeves_[color] roles to have Default color
        message.guild.roles.cache.forEach(role => {
            if (!role.name.includes('jeeves_')) {
                role.setColor('Default').catch(_ => null);
            }
        });

        createColorRolesIfNotExist(message.guild);
    }
}