"use strict";
///<reference path="../app.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleHandler = void 0;
const BaseHandler_1 = require("./BaseHandler");
const app_1 = require("../app");
class RoleHandler extends BaseHandler_1.BaseHandler {
    //return true if no further parsing needs to be done on message (in this case, if the message is deleted)
    ingest(messageArray, message) {
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        if (cmd === `${this.tradPrefix}setColor`) {
            this.SetColor(args, message);
            return true;
        }
        if (cmd === `${this.tradPrefix}setUpColorRoles`) {
            this.SetUpColorRoles(message);
            return true;
        }
    }
    //!SetColor [color]
    //If a valid color is given, user is given role 'jeeves_[color], which should be configured as the only roles with colors in the server
    //Other jeeves_[color] roles will be removed so user only ever has one
    SetColor(args, message) {
        if (args.length > 1) {
            message.channel.send("I'm sorry old sport, I didn't understand that.");
            return;
        }
        //If no args are given, or arg is not a valid color, post list of valid colors
        if (args.length < 1
            || message.guild.roles.cache.find(role => role.name == `jeeves_${args[0]}`) == undefined) {
            message.channel.send(`Please say which color you want to be from the following (mind your caps) - ${app_1.roleColorList.toString()}`);
            return;
        }
        //Remove all other color roles
        var colorRoleIter;
        for (var color of app_1.roleColorList) {
            if (color != args[0]) {
                colorRoleIter = message.member.roles.cache.find(r => r.name == `jeeves_${color}`);
                message.member.roles.remove(colorRoleIter).catch(_ => null);
            }
        }
        //Add requested role to user
        message.member.roles.add(message.guild.roles.cache.find(role => role.name == `jeeves_${args[0]}`));
    }
    SetUpColorRoles(message) {
        //Set all non jeeves_[color] roles to have Default color
        message.guild.roles.cache.forEach(role => {
            if (!role.name.includes('jeeves_')) {
                role.setColor('Default').catch(_ => null);
            }
        });
        (0, app_1.createColorRolesIfNotExist)(message.guild);
    }
}
exports.RoleHandler = RoleHandler;
//# sourceMappingURL=RoleHandler.js.map