import { IPermissions } from "../managers/server";
import { GuildMember } from "discord.js";

export default class PermissionsModule {
    private configuration: IPermissions;

    constructor(configuration: IPermissions) {
        this.configuration = configuration;
    }

    public isModerator(member: GuildMember) {
        return member.roles.filter(role => this.configuration.moderator.includes(role.id)).size > 0 || this.isAdministrator(member);
    }

    public isAdministrator(member: GuildMember) {
        return member.roles.filter(role => this.configuration.administrator.includes(role.id)).size > 0;
    }
}