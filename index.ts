import EventManager from "./managers/events";
import { CommandManager } from "./managers/commands";
import DatabaseManager from "./managers/database";
import ServersManager from './managers/server';
import { Client } from "discord.js";
import * as Config from './config.json';
import LoggerManager from "./managers/logger";

export interface IConfig {
  TOKEN: string,
  OWNERS: string[],
  PREFIX: string,
  DATABASE: {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  },
  DEBUG: boolean,
  COLOR: string
}

export default class Fenix {
  private static client: Client = new Client({
    disableEveryone: true,
    disabledEvents: [
      "GUILD_SYNC",
      "CHANNEL_PINS_UPDATE",
      "USER_NOTE_UPDATE",
      "RELATIONSHIP_ADD",
      "RELATIONSHIP_REMOVE",
      "USER_SETTINGS_UPDATE",
      "VOICE_STATE_UPDATE",
      "VOICE_SERVER_UPDATE",
      "TYPING_START",
      "PRESENCE_UPDATE"
    ],
    messageCacheLifetime: 120,
    messageSweepInterval: 480
  });
  private logger: LoggerManager = new LoggerManager('core');
  private static configuration: IConfig = Config;
  private static databaseManager: DatabaseManager = new DatabaseManager(Fenix.configuration.DATABASE);
  private static serversManager: ServersManager = new ServersManager();
  private static commandManager: CommandManager = new CommandManager();
  private static eventManager: EventManager = new EventManager();

  constructor() {
    this.logger.debug('Logging in discord...');
    Fenix.getClient().login(Fenix.getConfig().TOKEN)
      .then(() => this.logger.debug('Successfully logged in discord.'))
      .catch((error) => this.logger.debug(`Error in login: ${error}`));
  }

  public static getClient() {
    return this.client;
  }

  public static getEventManager() {
    return this.eventManager;
  }

  public static getCommandManager() {
    return this.commandManager;
  }

  public static getDatabaseManager() {
    return this.databaseManager;
  }

  public static getServersManager() {
    return this.serversManager;
  }

  public static getConfig() {
    return this.configuration;
  }
}

new Fenix();