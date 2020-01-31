import { IAutomod, Server } from "../managers/server";
import { Message } from "discord.js";
import SimpleEmbed from "../embeds";

export default class AutoModModule {
    private configuration: IAutomod;

    constructor(configuration: IAutomod) {
        this.configuration = configuration;
    }

    public filtredMessage(message: Message, server: Server) {
        if (server.getPermissionsModule().isModerator(message.member))
            return false;

        if (this.configuration.invites)
            return this.filterInvites(message);
        return false;
    }

    private filterInvites(message: Message) {
        if (message.content.match(/discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi)) {
            message.channel.send(new SimpleEmbed('Você não tem permissão de enviar convites aqui.', message.member.toString()));
            message.delete().catch();
            return true;
        }
    }
}