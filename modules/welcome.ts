import { IWelcome } from "../managers/server";
import { GuildMember, TextChannel } from "discord.js";

export class WelcomeModule {
    private configuration: IWelcome;

    constructor(configuration: IWelcome) {
        this.configuration = configuration;
    }

    public onMemberJoin(member: GuildMember) {
        if (!this.configuration.join.enabled || !member.guild)
            return;

        const channel = member.guild.channels.get(this.configuration.join.channel) as TextChannel;
        if (!channel)
            return;

        channel.send(JSON.parse(this.configuration.join.embed.replace(/{member}/gi, member.displayName))).catch();
    }
    public onMemberLeave(member: GuildMember) {
        if (!this.configuration.leave.enabled || !member.guild)
            return;

        const channel = member.guild.channels.get(this.configuration.leave.channel) as TextChannel;
        if (!channel)
            return;

        channel.send(JSON.parse(this.configuration.leave.embed.replace(/{member}/gi, member.displayName))).catch();
    }
}