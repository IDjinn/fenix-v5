import { IAutoRole } from "../managers/server";
import { GuildMember } from "discord.js";

export default class AutoRoleModule {
    private configuration: IAutoRole;

    constructor(configuration: IAutoRole) {
        this.configuration = configuration;
    }

    public async giveRoles(member: GuildMember) {
        if (this.configuration.enabled && this.configuration.roles.length > 0)
            Promise.resolve(member.addRoles(this.configuration.roles)).catch();
    }
}