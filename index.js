const { Client, MessageEmbed, Message, Presence, GuildMember } = require("discord.js");
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION"] });
const { token, prefix } = require("./config.json");
const enmap = require('enmap')
const pagination = require('discord.js-pagination');

const cheerio = require('cheerio')
const request = require('request')

const command = require('./command')
const privateMessage = require('./mensaje-privado')
const roleClaim = require('./role-dar')
const firstMessage = require('./primer-mensaje')

const PREFIX = 'e!';

client.on('ready', () => {
    console.log('Estoy listo')


    // COMANDO LIMPIEZA MENSAJES 


    command(client, ['cc', 'limpieza'], message => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    })


    // COMANDO PARA CAMBIAR EL STATUS DEL BOT CON COMANDO


    command(client, 'status', message => {
        const content = message.content.replace('e!status ', '');

        client.user.setPresence({
            activity: {
                name: content,
                type: 0
            }
        })
    })

    privateMessage(client, 'e!ayuda', 'Buenas, he venido a ayudarte!')

    firstMessage(client, '766611299496886283', 'hola mundo!', ['👋'])

    roleClaim(client)


    // COMANDO BAN


    command(client, 'ban', message => {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBER')
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} Se ha baneado al usuario seleccionado.`)
            } else {
                message.channel.send(`${tag} Por favor, especifica a alguien.`)
            }
        } else {
            message.channel.send(`${tag} No tienes permisos para hacer esto!`)
        }
    })


    // COMANDO KICK


    command(client, 'kick', message => {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBER')
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${tag} Se ha kickeado al usuario seleccionado.`)
            } else {
                message.channel.send(`${tag} Por favor, especifica a alguien.`)
            }
        } else {
            message.channel.send(`${tag} No tienes permisos para hacer esto!`)
        }
    })


    // PRESENCIA DEL BOT


    client.user.setPresence({ activity: { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' }, status: 'online' })
});


// TICKETS


const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == "ticket-crear") {
        let channel = message.mentions.channels.first();

        if (!channel) return message.reply("Uso: `e!ticket-setup #canal`");

        let sent = await channel.send(new MessageEmbed()
            .setTitle("Sistema de Tickets oficial.")
            .setDescription("Reacciona para abrir un ticket")
            .setFooter("Sistema de tickets de (nombre del bot)")
            .setColor(0x00ff00)
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("La instalación se ha completado")
    }

    if (command == "cerrar") {
        if (!message.channel.name.includes("ticket-")) return message.channel.send("No puedes hacer eso!")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if (!ticketid) return;

    if (reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new MessageEmbed().setTitle("``Nuevo Ticket! Bienvenido/a``").setDescription("\nIntentaremos solucionar tus problemas lo antes posible").setColor(0x00ff00).setFooter("Sistema de Tickets").setTimestamp())
        })
    }
});


// BIENVENIDAS


client.on("guildMemberAdd", member => {
    let canal = client.channels.cache.get('768108520671150080')
    canal.send(`Bienvenido a **${member.guild.name}**, <@!${member.user.id}> !`);

    member.roles.add("762672668100263966");
})


// DESPEDIDAS


client.on("guildMemberRemove", member => {
    let canal = client.channels.cache.get('768109928799404071')
    canal.send(`Adiós **${member.user.tag}**, esperamos que te lo hayas pasado bien en **${member.guild.name}**`);

})


// ENVIAR MEMES DE GOOGLE


client.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'dank':
        image(message);

        break;
    }
})

function image(message){

    var options = {
        url: "https://results.dogpile.com/serp?qc=images&q=" + "minecraft",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
       
        console.log(urls);
 
        if (!urls.length) {
           
            return;
        }

        message.channel.send( urls[Math.floor(Math.random() * urls.length)] + " " + message.guild.members.random());
    });
}


// INFORMACIÓN DEL BOT


client.on("message", message => {
    if (message.content === ("e!infobot")) {
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('``Información del bot``')
            .setColor('#7289da')
            .setDescription("Aquí os enseñaré alguna información sobre mí!")
            .addField("``📺 Canales``", `Vigilando ${client.channels.cache.size} canales.`, false)
            .addField("``👥 Usuarios del servidor``", `Estos son los usuarios actuales ${client.users.cache.size} `, false)
            .addField("``📆 Fecha de creación``", client.user.createdAt, false)
            .addField("``🎉 Servers``", `Estoy en ${client.guilds.cache.size} servers!`, false)
            .addField("``📈 Ping``", `${Math.round(client.ws.ping)}ms`, false)
            .addField("``🥳 Invitame !``", "Click [Aquí](https://discord.com/api/oauth2/authorize?client_id=762662775150346280&permissions=8&scope=bot)", false)
            .setFooter("Creado por akaSniipz#5694 | Bot developing")
            .setTimestamp();
        message.channel.send(embed)
    }
});


// VER MIEMBROS DEL DISCORD CON COMANDO


client.on("message", message => {
    if (message.content === ("e!miembros")) {
        const embed = new MessageEmbed()
            .setTitle('``Actuales miembros del server:``')
            .setColor('#7289da')
            .setDescription(`${client.users.cache.size}`)
            .setFooter("Creado por akaSniipz#5694 | Bot developing")
            .setTimestamp();
        message.channel.send(embed)
    }
});


// INFO COMANDOS DEL BOT


client.on("message", message => {
    if (message.content === ("e!comandos")) {

    }
})


// lOG MENSAJES ELIMINADOS

client.on("messageDelete", (message) => {
    let canal = client.channels.cache.get('768120969893380117'); 
    canal.send(`**${message.author.tag}** eliminó un mensaje con el contenido: **${message}**`);
   
});


// COMANDO PING



client.on("message", message => {
    if (message.content === ("e!ping")) {
        const embed = new MessageEmbed()
            .setTitle("``Este es el actual ping del bot 📈``")
            .setDescription(`${Math.round(client.ws.ping)}ms`)
            .setColor('#7289da')
            .setTimestamp()
        message.channel.send(embed)
    }
})


// VOTACIONES

client.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if(cmd === 'e!votar'){
        let pollChannel = message.mentions.channels.first();
        let pollDescription = args.slice(1).join(' ');

        let embedPoll = new MessageEmbed()
        .setTitle("``📈 Nueva votación``")
        .setDescription(pollDescription)
        .setColor('#7289da')
        .setFooter(`Sistema de votaciones`)
        .setTimestamp()
        let msgEmbed = await pollChannel.send(embedPoll);
        await msgEmbed.react('✅')
        await msgEmbed.react('❌')
    }
})

client.login(token);