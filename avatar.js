const Discord = require('discord.js');

module.exports = {
    name: "avatar",
    description: "Enseñar avatar de un usuario",

    async run (client, message, args) {

        let member = member.mentions.user.first() || message.author

        let avatar = member.displayAvatarURL({size: 1024})

        const embed = new Discord.MessageEmbed()
        .setTitle(`Este es el avatar de ${member.usuarname}` )
        .setImage(avatar)
        .setColor('#7289da')

        message.channel.send(embed);
    }
}