const { MessageEmbed } = require('discord.js')
const os = require('os')
module.exports = {
    name: "bot-info",
    category: "bot",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('``Información del bot``')
            .setColor('#000000')
            .addFields(
                {
                    name: '🌐 Servers',
                    value: `Sirviendo en ${client.guilds.cache.size} servers.`,
                    inline: true
                },
                {
                    name: '📺 Channels',
                    value: `Sirviendo en ${client.channels.cache.size} canales.`,
                    inline: true
                },
                {
                    name: '👥 Usuarios del servidor',
                    value: `Sirviendo con ${client.users.cache.size} usuarios`,
                    inline: true
                },
                {
                    name: '⏳ Ping',
                    value: `${Math.round(client.ws.ping)}ms`,
                    inline: true
                },
                {
                    name: 'Fecha de entrada',
                    value: client.user.createdAt,
                    inline: true
                },
                {
                    name: 'Info del Server',
                    value: `Cores: ${os.cpus().length}`,
                    inline: true
                }
            )
            .setFooter(`Creado por: ${message.author.tag}`, message.author.displayAvatarURL())
            //.setFooter("Creado por akaSniipz#5694 | Bot developing")

        await message.channel.send(embed)
    }
}