import { ICommand } from '../../managers/commands';
import { Client, Message } from 'discord.js';

const clean = (text: string) => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
}

export default class Ping implements ICommand {
    name = 'Eval';
    description = 'Para o uso do criador.';
    onlyowner = true;
    aliases = [];
    permissionsNeed = [];
    permissionsBot = [];
    enabled = true;

    async run(_client: Client, message: Message, args: string[]) {
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "js", split: true });
        } catch (err) {
            message.channel.send(`\`Erro\` \`\`\`js\n${clean(err)}\n\`\`\``);
        }
    }
}