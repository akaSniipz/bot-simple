module.exports = (client, triggerText, replytext) => {
    client.on('message', message => {
        if (
        message.channel.type === 'dm' && 
        message.content.toLowerCase() === triggerText.toLowerCase()) {
            message.author.send(replytext)
        }
    })
}