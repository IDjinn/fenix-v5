import { Collection, Message, GuildMember } from "discord.js";
import Eval from '../commands/owner/eval';
import SimpleEmbed from "../embeds";
import { Server } from "./server";

import Ping from "../commands/others/ping";
import Commands from "../commands/others/commands";
import Clear from "../commands/mods/clear";
import Kick from "../commands/mods/kick";
import Ban from "../commands/mods/ban";
import Fenix from '../index';
import LoggerManager from "./logger";
export class CommandManager {
    private commands: Collection<string, ICommand> = new Collection<string, ICommand>();
    private aliases: Collection<string, string> = new Collection<string, string>();
    private logger: LoggerManager = new LoggerManager('commands');

    constructor() {
        this.registerCommand(new Ping());
        this.registerCommand(new Commands());
        this.registerCommand(new Eval());
        this.registerCommand(new Clear());
        this.registerCommand(new Kick());
        this.registerCommand(new Ban());
    }

    private registerCommand(command: ICommand) {
        this.logger.debug(`Registering command ${command.name}`);
        this.commands.set(command.name.toLowerCase(), command);
        command.aliases.map(aliase => this.aliases.set(aliase, command.name.toLowerCase()));
    }

    private commandEnabled(command: ICommand, id: string) {
        if (command.onlyowner && !Fenix.getConfig().OWNERS.includes(id))
            return false;
        if (!command.enabled)
            return false;
        return true;
    }

    private memberHasPermission(command: ICommand, member: GuildMember) {
        if (command.permissionsNeed.length === 0)
            return true;
        else if (command.permissionsNeed.filter(p => !member.hasPermission(p)).length > 0)
            return false;
        return true;
    }

    private botHasPermission(command: ICommand, member: GuildMember) {
        if (command.permissionsBot.length === 0)
            return true;
        else if (command.permissionsBot.filter(p => !member.hasPermission(p)).length > 0)
            return false;
        return true;
    }

    public handleMessage(message: Message, server: Server) {
        if (!message.content.startsWith(Fenix.getConfig().PREFIX))
            return false;

        const args = message.content.split(' ');
        const command = args[0].slice(Fenix.getConfig().PREFIX.length).toLowerCase();
        if (command.length === 0) return false;

        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command) || '') as ICommand;
        if (cmd !== undefined)
            if (this.commandEnabled(cmd, message.author.id))
                if (server.commandChannels.includes(message.channel.id) || server.getPermissionsModule().isModerator(message.member))
                    if (this.memberHasPermission(cmd, message.member))
                        if (this.botHasPermission(cmd, message.guild.me)) {
                            cmd.run(message.client, message, args.slice(1));
                            message.delete().catch();
                            this.logger.debug(`User ${message.author.id} running command ${cmd.name}`);
                            return true;
                        }
                        else message.channel.send(new SimpleEmbed(`Oops, parece que eu não tenho as permissões necessárias para executar esse comando.`, message.member.toString()));
                    else message.channel.send(new SimpleEmbed(`Oops, parece que você não tem todas as permissões necessárias para utilizar esse comando.`, message.member.toString()));
                else message.channel.send(new SimpleEmbed(`Você não pode usar comandos nesse canal, apenas em ${server.commandChannels.map(channel => `<#${channel}>`).join(', ')}`, message.member.toString())).then((m: any) => m.delete(6000));
            else message.channel.send(new SimpleEmbed(`Oops, parece que esse comando está desativado no momento, ou apenas para uso do criador.`, message.member.toString()));
        else message.channel.send(new SimpleEmbed(`Oops, parece que não encontrei esse comando. Para ver todos os comandos disponíveis, use \`>comandos\``, message.member.toString()));
        return false;
    }

    public getCommand(command: string) {
        return this.commands.get(command) || this.commands.get(this.aliases.get(command) || '');
    }

    public getCommands() {
        return this.commands;
    }

    public getAliases() {
        return this.aliases;
    }

    public commandsForMember(member: GuildMember) {
        return this.commands.filter(x => this.memberHasPermission(x, member));
    }
}


export interface ICommand {
    name: string;
    description: string;
    onlyowner: boolean;
    aliases: string[];
    permissionsNeed: Permissions[] | [];
    permissionsBot: Permissions[] | [];
    enabled: boolean;
    run: Function;
}

export enum Permissions {
    CREATE_INSTANT_INVITE = 1,
    KICK_MEMBERS = 2,
    BAN_MEMBERS = 4,
    ADMINISTRATOR = 8,
    MANAGE_CHANNELS = 16,
    MANAGE_GUILD = 32,
    ADD_REACTIONS = 64,
    VIEW_AUDIT_LOG = 128,
    PRIORITY_SPEAKER = 256,
    VIEW_CHANNEL = 1024,
    READ_MESSAGES = 1024,
    SEND_MESSAGES = 2048,
    SEND_TTS_MESSAGES = 4096,
    MANAGE_MESSAGES = 8192,
    EMBED_LINKS = 16384,
    ATTACH_FILES = 32768,
    READ_MESSAGE_HISTORY = 65536,
    MENTION_EVERYONE = 131072,
    EXTERNAL_EMOJIS = 262144,
    USE_EXTERNAL_EMOJIS = 262144,
    CONNECT = 1048576,
    SPEAK = 2097152,
    MUTE_MEMBERS = 4194304,
    DEAFEN_MEMBERS = 8388608,
    MOVE_MEMBERS = 16777216,
    USE_VAD = 33554432,
    CHANGE_NICKNAME = 67108864,
    MANAGE_NICKNAMES = 134217728,
    MANAGE_ROLES = 268435456,
    MANAGE_ROLES_OR_PERMISSIONS = 268435456,
    MANAGE_WEBHOOKS = 536870912,
    MANAGE_EMOJIS = 1073741824
};