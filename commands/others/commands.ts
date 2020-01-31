import { ICommand } from '../../managers/commands';
import { Client, Message, RichEmbed, Collection } from 'discord.js';
import Fenix from '../../index';

export default class Commands implements ICommand {
    name = 'Comandos';
    description = 'Mostra todos os comandos disponíveis';
    onlyowner = false;
    aliases = ['help', 'ajuda'];
    permissionsNeed = [];
    permissionsBot = [];
    enabled = true;

    async run(_client: Client, message: Message, _args: string[]) {
        const commands: Collection<string, ICommand> = Fenix.getCommandManager().commandsForMember(message.member);
        message.channel.send(new RichEmbed().setColor(Fenix.getConfig().COLOR)
            .setTitle('Comandos disponíveis para você').setDescription(commands.map(c => `\`${c.name}\` - ${c.description}`).join('\n')))
    }
}