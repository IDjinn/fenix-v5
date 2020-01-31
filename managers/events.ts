import { Message, GuildMember, Guild } from "discord.js";
import Fenix from '../index';
import { Server } from "./server";
import SimpleEmbed from "../embeds";
import LoggerManager, { LogType } from "./logger";

export default class EventsManager {
    private logger: LoggerManager = new LoggerManager('events');

    constructor() {
        this.logger.debug('Loading events...');
        Fenix.getClient().on('ready', () => {
            this.logger.log('Ready!', LogType.INFO);
            this.filterGuilds();
        });
        Fenix.getClient().on('guildCreate', () => this.filterGuilds());
        Fenix.getClient().on('message', async (message: Message) => {
            if (message.type !== 'DEFAULT' || message.channel.type !== 'text' || message.author.bot === true)
                return;

            const server = Fenix.getServersManager().get(message.guild.id) as Server;
            if (server === undefined)
                return;

            if (server.getAutoModModule().filtredMessage(message, server))
                return;

            if (Fenix.getCommandManager().handleMessage(message, server))
                return;

            if (message.content.startsWith(`<@${message.guild.me.id}>`))
                return message.channel.send(new SimpleEmbed(`Olá, se deseja saber todos os meus comandos disponíveis para você, use \`${server.perfix}comandos\`!`, message.member.toString()))
        });
        Fenix.getClient().on('messageUpdate', (oldmessage: Message, newmessage: Message) => {
            if (oldmessage.type !== 'DEFAULT' || oldmessage.channel.type !== 'text' || oldmessage.author.bot === true)
                return;

            if (newmessage.content === oldmessage.content || newmessage.content === undefined)
                return;

            const server = Fenix.getServersManager().get(newmessage.guild.id) as Server;
            if (server === undefined)
                return;

            if (server.getAutoModModule().filtredMessage(newmessage, server))
                return;

            if (Fenix.getCommandManager().handleMessage(newmessage, server))
                return;
        });
        Fenix.getClient().on('guildMemberAdd', (member: GuildMember) => {
            const server = Fenix.getServersManager().get(member.guild.id) as Server;
            if (server === undefined)
                return;

            this.logger.debug(`Member ${member.id} joined in the guild ${member.guild.id}.`);
            server.getWelcomeModule().onMemberJoin(member);
            server.getAutoRoleModule().giveRoles(member);
            server.getCounterModule().update(member);
        });
        Fenix.getClient().on('guildMemberRemove', (member: GuildMember) => {
            const server = Fenix.getServersManager().get(member.guild.id) as Server;
            if (server === undefined)
                return;

            this.logger.debug(`Member ${member.id} leave from the guild ${member.guild.id}.`);
            server.getWelcomeModule().onMemberLeave(member);
            server.getCounterModule().update(member);
        });
        Fenix.getClient().on('error', (error: Error) => {
            this.logger.log(error, LogType.ERROR);
        });
        Fenix.getClient().on('warn', (warn: string) => {
            this.logger.log(warn, LogType.WARN);
        });
        process.on('warning', (warn: Error) => {
            this.logger.log(warn, LogType.WARN);
        });
        process.on('uncaughtException', (error: Error) => {
            this.logger.log(error, LogType.ERROR);
        });
        this.logger.log('Ready!', LogType.INFO);
    }

    private filterGuilds() {
        Fenix.getClient().guilds.filter((guild: Guild) => !Fenix.getServersManager().get(guild.id)).map(async (guild: Guild) => {
            this.logger.log(`Guild ${guild.id} doesn't exists in the database.`, LogType.WARN);
            guild.leave();
        });
    }
}