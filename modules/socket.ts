import { Socket, connect } from 'net';
import { ISocket } from '../managers/server';
import LoggerManager, { LogType } from '../managers/logger';
import { Message } from 'discord.js';

export default class SocketModule {
    private socket: Socket | undefined;
    // private sendHeartbeat: NodeJS.Timer | null = null;
    private timeout: any;
    private logger: LoggerManager;
    private configuration: ISocket;
    public constructor(configuration: ISocket) {
        this.configuration = configuration;
        this.logger = new LoggerManager('Socket');
        this.connect();
    }

    public connect() {
        console.log(this.configuration);
        if (!this.configuration.enabled)
            return;

        if (this.socket) this.socket.removeAllListeners();
        try {
            this.logger.debug('Trying to connect');
            this.socket = connect(this.configuration);

            this.prepareEvents();
        } catch (error) {
            this.logger.debug('Connection fail, trying reconnect...');
            this.timeout = setTimeout(this.connect.bind(this), 5000);
        }
    }

    public disconnect() {
        if (!this.socket) return;
        this.socket.destroy();
    }
    /*
        private heartbeat(ms: number) {
            this.sendHeartbeat = this.client.setInterval(() => {
                this.socket!.write(JSON.stringify({ op: 9 }));
            }, ms);
        }
    */
    public chatStaff(message: Message) {
        if (!this.socket)
            return;
        this.socket.write(JSON.stringify({
            from: 'bot',
            to: 'emulator',
            command: 'chat_staff',
            args: [message.content]
        }))
    }

    private prepareEvents() {
        this.logger.debug('Loading events...');
        this.socket!.on('connect', this.onOpen.bind(this));
        this.socket!.on('data', this.onMessage.bind(this));
        this.socket!.on('close', this.onClose.bind(this));
        this.socket!.on('error', (err: any) => this.logger.log(err, LogType.ERROR));
    }

    private onOpen() {
        //this.client.clearInterval(this.sendHeartbeat!);
        this.logger.log('Connected!', LogType.INFO);
        clearTimeout(this.timeout);
    }

    private onMessage(data: any) {
        this.logger.debug(data);
    }

    private onClose(code: number) {
        if (code === 1000) return;
        //this.client.clearInterval(this.sendHeartbeat!);
        this.logger.log('Closed...', LogType.WARN);
        this.timeout = setTimeout(this.connect.bind(this), 5000);
    }
}