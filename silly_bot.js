const discord = require('discord.js');
const client = new discord.Client();

let lastNumber = 0;
const userNotCountMap = new Map(); 
const userMessageCount = new Map(); 
const prefix = "!"; //prefix for commands

const checkGreeting = message => message.content.toLowerCase().startsWith('gm') || message.content.toLowerCase().startsWith('gn');
const handleCountingFailure = message => {message.channel.send('you suck at counting!'); lastNumber = 0;}

// bot startup event
client.on('ready', () => console.log(`logged in as ${client.user.tag}`));

// incoming messages 
client.on('message', message => {
  if (message.author.bot) return;
  
  // command system
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help') {
      message.channel.send('commands: help');
      return;
    }
  }

  // anti-spam system
  if (userMessageCount.get(message.author.id) > 5) {
    // mute or warn the user
    message.channel.send(`${message.author}, please don't spam.`);
    return;
  }
  
  if (message.channel.name === 'counting・') {
    if (/^\d+$/.test(message.content)) {
      const number = parseInt(message.content);
      if (number === lastNumber + 1 || lastNumber === 0) {
        lastNumber = number;
        userNotCountMap.set(message.author.id, 0); // reset notCount
        userMessageCount.set(message.author.id, 0); // reset message count
      } else if (lastNumber !== 0 && number !== lastNumber + 1) handleCountingFailure(message);
    } else if (checkGreeting(message)) {
      const notCount = (userNotCountMap.get(message.author.id) || 0) + 1;
      userNotCountMap.set(message.author.id, notCount);
      message.channel.send(`good day ${message.member.displayName}!`);
      if (notCount === 10) message.channel.send(`wow, ${message.member.displayName}, it's been so long since you've counted...`);
    }
  }

  // increase the message count for the user
  userMessageCount.set(message.author.id, (userMessageCount.get(message.author.id) || 0) + 1);
});

// user join
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general'); // adjust channel name accordingly
  if (!channel) return;
  channel.send(`welcome, ${member}`);
});

// user leave
client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general'); // adjust channel name accordingly
  if (!channel) return;
  channel.send(`goodbye, ${member}`);
});

