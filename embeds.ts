import { RichEmbed } from "discord.js";
import Fenix from './index';

export default class SimpleEmbed extends RichEmbed {
    constructor(message: string, member: string = '') {
        super();
        this.setDescription(`${member ? member + ', ' : ''}${message}`);
        this.setColor(Fenix.getConfig().COLOR);
    }
}