const firstMessage = require('./primer-mensaje')

module.exports = (client) => {
    const channelId = '766612400585441310'

    const getEmoji = (emojiName) => 
    client.emojis.cache.find((emoji) => emoji.name === emojiName)

    const emojis = {
        Verificado: 'Verificado',
    }

    const reactions = []

    let emojiText = 'Reacciona al emoji para verificarte!\n\n'
    for (const key in emojis) {
        const emoji = getEmoji(key)
        reactions.push(emoji)

        const role = emojis[key]
        emojiText += `${emoji} = ${role}\n`
    }
    
    firstMessage(client, channelId, emojiText, reactions)

    const handleReaction = (reaction, user, add) => {
        if(user.id === '762662775150346280') {
            return
        }

        console.log(reaction)

        const emoji = reaction._emoji.name

        const { guild } = reaction.message

        const roleName = emojis[emoji]
        if (!roleName) {
            return
        }

        const role = guild.roles.cache.find(role => role.name === roleName)
        const member = guild.members.cache.find(member => member.id === user.id)

        if (add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, true)
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, false)
        }
    })

}