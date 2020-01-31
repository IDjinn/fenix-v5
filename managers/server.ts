import { Collection } from "discord.js";
import { WelcomeModule } from "../modules/welcome";
import CounterModule from "../modules/counter";
import AutoRoleModule from "../modules/autorole";
import PermissionsModule from "../modules/permissions";
import AutoModModule from "../modules/automod";
import Fenix from '../index';
import LoggerManager, { LogType } from "./logger";
import SocketModule from "../modules/socket";
export default class ServerManager {
    private servers: Collection<string, Server> = new Collection();
    private logger: LoggerManager = new LoggerManager('servers');

    constructor() {
        this.logger.debug('Loading servers config...');
        Fenix.getDatabaseManager().runQuery(`SELECT * FROM \`1fenix_bot\``).then((rows: any) => {
            if (rows) return rows.forEach((row: any) => {
                this.servers.set(row.id, new Server(row));
            });
        });
        this.logger.log('Ready!', LogType.INFO);
    }

    public get(id: string) {
        return this.servers.get(id);
    }

    public all() {
        return this.servers;
    }
}

export interface IWelcome {
    join: {
        enabled: boolean,
        channel: string,
        embed: string
    },
    leave: {
        enabled: boolean,
        channel: string,
        embed: string
    },
}

export interface ICounter {
    member: {
        enabled: boolean,
        channel: string,
        name: string,
    },
}

export interface IAutoRole {
    enabled: boolean;
    roles: string[];
}

export interface IPermissions {
    administrator: string[];
    moderator: string[];
}

export interface IAutomod {
    invites: boolean;
}

export interface ISocket {
    host: string,
    port: number,
    enabled: boolean
}

export class Server {
    public readonly id: string;
    public readonly perfix: string;
    protected welcome: IWelcome;
    protected counter: ICounter;
    protected autorole: IAutoRole;
    protected permissions: IPermissions;
    public readonly commandChannels: string[];
    protected automod: IAutomod;
    protected socket: ISocket;

    private welcomeModule: WelcomeModule;
    private counterModule: CounterModule;
    private autoRoleModule: AutoRoleModule;
    private permissionsModule: PermissionsModule;
    private autoModModule: AutoModModule;
    private socketModule: SocketModule;

    constructor(data: any) {
        this.id = data.id;
        this.perfix = data.perfix;
        this.welcome = {
            join: {
                enabled: this.parseEnum(data.welcome_join_enabled),
                channel: data.welcome_join_channel,
                embed: data.welcome_join_embed,
            },
            leave: {
                enabled: this.parseEnum(data.welcome_leave_enabled),
                channel: data.welcome_leave_channel,
                embed: data.welcome_leave_embed,
            },
        }
        this.counter = {
            member: {
                enabled: this.parseEnum(data.counter_member_enabled),
                channel: data.counter_member_channel,
                name: data.counter_member_name,
            }
        }
        this.autorole = {
            enabled: this.parseEnum(data.autorole_enabled),
            roles: data.autorole_roles,
        }
        this.permissions = {
            administrator: data.administrator_roles.split(';') || [],
            moderator: data.moderator_roles.split(';') || []
        }
        this.automod = {
            invites: this.parseEnum(data.automod_invites_enabled),
        }
        this.socket = {
            host: data.socket_host,
            port: data.socket_port,
            enabled: this.parseEnum(data.socket_enabled)
        }
        this.commandChannels = data.command_channels.split(';') || [];

        this.welcomeModule = new WelcomeModule(this.welcome);
        this.counterModule = new CounterModule(this.counter);
        this.autoRoleModule = new AutoRoleModule(this.autorole);
        this.permissionsModule = new PermissionsModule(this.permissions);
        this.autoModModule = new AutoModModule(this.automod);
        this.socketModule = new SocketModule(this.socket);
    }

    private parseEnum(string: string) {
        return string === "1";
    }

    public getWelcomeModule() {
        return this.welcomeModule;
    }

    public getCounterModule() {
        return this.counterModule;
    }

    public getAutoRoleModule() {
        return this.autoRoleModule;
    }

    public getPermissionsModule() {
        return this.permissionsModule;
    }

    public getAutoModModule() {
        return this.autoModModule;
    }

    public getSocketModule() {
        return this.socketModule;
    }
}