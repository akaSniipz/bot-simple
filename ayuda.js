const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'pues ayuda LOL',

    async run (client, message, args) {

        const moderacion = new Discord.MessageEmbed()
        .setTitle("Moderación")
        .setColor('#7289da')
        .addField("``e!kick``", "Kickea a un usuario mencionado", false)
        .addField("``e!ban``", "Banea a un usuario mencionado", false)
        .addField("``e!limpieza``", "Borra todos los mensajes de un canal", false)
        .setTimestamp()

        const diversion = new Discord.MessageEmbed()
        .setTitle("Diversión")
        .setColor('#7289da')
        .setDescription("Aquí aun no hay nada, avanza")
        .setTimestamp()

        const informacion = new Discord.MessageEmbed()
        .setTitle("Información")
        .setColor('#7289da')
        .addField("``e!infobot``", "Aparezerá una lista de cosas sobre el bot", false)
        .addField("``e!ping``", "Enviará un mensaje enseñando el actual ping del bot", false)
        .setTimestamp()

        const pages = [
            moderacion,
            diversion,
            informacion
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}