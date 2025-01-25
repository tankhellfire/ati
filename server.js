const {Client,GatewayIntentBits} = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent // This is needed for accessing message content in newer versions of Discord.js
  ] 
});

client.login(process.env.DISCORD_BOT_TOKEN); // Make sure to set your bot token in the environment variable

// Event listener for when the bot is ready
client.once('ready', () => {
  console.log('Bot is online and ready!');
});

// Event listener for when a message is sent
client.on('messageCreate', (message) => {
  // If the message is from the bot itself, ignore it
  if (message.author.bot) return;

  // Log the message content to the console
  console.log(`Message from ${message.author.tag}: ${message.content}`);

  // Respond to the message
  if (message.content.toLowerCase() === 'ping') {
    message.channel.send('Pong!');
  }
});
