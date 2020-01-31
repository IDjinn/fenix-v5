import { ICounter } from "../managers/server";
import { GuildMember, GuildChannel } from "discord.js";

export default class CounterModule {
    private configuration: ICounter;

    constructor(configuration: ICounter) {
        this.configuration = configuration;
    }

    public update(member: GuildMember) {
        if (!this.configuration.member.enabled || !member.guild)
            return;

        const channel = member.guild.channels.get(this.configuration.member.channel) as GuildChannel;
        if (channel !== undefined && channel.manageable)
            channel.setName(this.configuration.member.name.replace(/{members}/g, '' + member.guild.memberCount)).catch();
    }
}