import { ICommand } from '../../managers/commands';
import { Client, Message } from 'discord.js';
import SimpleEmbed from '../../embeds';

export default class Ping implements ICommand {
    name = 'Ping';
    description = 'Verifica a latência do bot.';
    onlyowner = false;
    aliases = [];
    permissionsNeed = [];
    permissionsBot = [];
    enabled = true;

    async run(client: Client, message: Message, _args: string[]) {
        const m = await message.reply('Calculando...') as Message;
        m.edit('', new SimpleEmbed(`Pong! Latência ${m.createdTimestamp - message.createdTimestamp}ms. Latência API: ${Math.round(client.ping)}ms.`, message.member.toString()));
    }
}