const Discord = require('discord.js');
const client = new Discord.Client();

let lastNumber = 0; // Initialize the last sent number
let notCount = 0;

// Event handler for bot startup
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for incoming messages
client.on('message', (message) => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Check if the message is in the "counting" channel
  if (message.channel.name === 'counting・') {
    // Parse the content as a number
  
    // Check if the content is a valid number and greater than the last sent number
    if (/^\d+$/.test(message.content)) {
      // Update the last sent number
      const number = parseInt(message.content);
      if (number === lastNumber + 1) {
      lastNumber = number;

      notCount = 0;
      }
      else if (lastNumber != 0 && number != lastNumber + 1) {
         message.channel.send(`YOU SUCK AT COUNTING BOOOOOO GO BACK TO SCHOOL`);
         lastNumber = 0; //back to 0 we go
      }
    } else {
    
      notCount++;
      if (notCount === 10) {
        
          message.channel.send(`Wow, it's been so long since you've counted...`);
        
        }
    }
  }
});
