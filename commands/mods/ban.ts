import { ICommand, Permissions } from '../../managers/commands';
import { Client, Message, GuildMember } from 'discord.js';
import SimpleEmbed from '../../embeds';

export default class Ban implements ICommand {
    name = 'Ban';
    description = 'Bane alguém do servidor.';
    onlyowner = false;
    aliases = ['banir'];
    permissionsNeed = [Permissions.BAN_MEMBERS];
    permissionsBot = [Permissions.BAN_MEMBERS];
    enabled = true;

    async run(_client: Client, message: Message, args: string[]) {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) as GuildMember;
        if (!member)
            message.channel.send(new SimpleEmbed('Você precisa mencionar ou dizer o ID de quem deseja banir.', message.member.toString()));
        else if (member.id === message.guild.me.id)
            message.channel.send(new SimpleEmbed('Não posso me kickar!', message.member.toString()));
        else if (member.id === message.author.id)
            message.channel.send(new SimpleEmbed('Não posso te kickar!', message.member.toString()));
        else if (!member.kickable)
            message.channel.send(new SimpleEmbed('Não consigo banir esse membro, ele pode ter cargo igual ou superior ao meu.', message.member.toString()));
        else {
            member.ban(args.slice(1).join(' ')).then((() => {
                message.channel.send(new SimpleEmbed(`Membro ${member} banido com sucesso!`, message.member.toString()));
            })).catch((error) => {
                message.channel.send(new SimpleEmbed('Parece que ocorreu um erro ao tentar banir esse membro.', message.member.toString()));
                throw error;
            });
        }
    }
}