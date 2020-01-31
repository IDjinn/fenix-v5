import { ICommand, Permissions } from '../../managers/commands';
import { Client, Message, GuildMember } from 'discord.js';
import SimpleEmbed from '../../embeds';

export default class Kick implements ICommand {
    name = 'Kick';
    description = 'Expulsa alguém do servidor.';
    onlyowner = false;
    aliases = ['expulsar', 'kickar'];
    permissionsNeed = [Permissions.KICK_MEMBERS];
    permissionsBot = [Permissions.KICK_MEMBERS];
    enabled = true;

    async run(_client: Client, message: Message, args: string[]) {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) as GuildMember;
        if (!member)
            message.channel.send(new SimpleEmbed('Você precisa mencionar ou dizer o ID de quem deseja kickar.', message.member.toString()));
        else if (member.id === message.guild.me.id)
            message.channel.send(new SimpleEmbed('Não posso me kickar!', message.member.toString()));
        else if (member.id === message.author.id)
            message.channel.send(new SimpleEmbed('Não posso te kickar!', message.member.toString()));
        else if (!member.kickable)
            message.channel.send(new SimpleEmbed('Não consigo kickar esse membro, ele pode ter cargo igual ou superior ao meu.', message.member.toString()));
        else {
            member.kick(args.slice(1).join(' ')).then((() => {
                message.channel.send(new SimpleEmbed(`Membro ${member} expulso com sucesso!`, message.member.toString()));
            })).catch((error) => {
                message.channel.send(new SimpleEmbed('Parece que ocorreu um erro ao tentar expulsar esse membro.', message.member.toString()));
                throw error;
            });
        }
    }
}