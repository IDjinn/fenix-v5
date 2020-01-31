import { ICommand, Permissions } from '../../managers/commands';
import { Client, Message, Collection } from 'discord.js';
import SimpleEmbed from '../../embeds';

export default class Clear implements ICommand {
    name = 'Limpar';
    description = 'Limpa mensagens de um canal.';
    onlyowner = false;
    aliases = ['clear'];
    permissionsNeed = [Permissions.MANAGE_MESSAGES];
    permissionsBot = [Permissions.MANAGE_MESSAGES];
    enabled = true;

    async run(_client: Client, message: Message, args: string[]) {
        const amount: number = parseInt(args[0]);
        if (!amount)
            message.channel.send(new SimpleEmbed('Você precisa definir o número de mensagens que quer deletar, de 1-100.', message.member.toString()));
        else if (amount < 1 || amount > 100)
            message.channel.send(new SimpleEmbed('Você precisa definir uma quantidade válida! (0-100).', message.member.toString()))
        else {
            message.channel.bulkDelete(amount, true).then((messages: Collection<string, Message>) => {
                if (messages.size > 0)
                    message.channel.send(new SimpleEmbed(`${messages.size} mensagens limpas com sucesso!`, message.member.toString()));
                else
                    message.channel.send(new SimpleEmbed('Nenhuma mensagem foi limpa, talvez sejam muito antigas.', message.member.toString()));
            });
        }
    }
}