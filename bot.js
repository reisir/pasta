require("dotenv/config");
const { token } = process.env;
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { Commands, Chef } = require("./Pasta");

// Reads directories synchronously before even connecting to discord
const Remy = new Chef();

// New client, ask for permissions
const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildEmojisAndStickers,
  ],
});

/* CONNECTED */
DiscordClient.once(Events.ClientReady, (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});

/* JOINED */
DiscordClient.on(Events.GuildCreate, (client) => {
  console.log(`Joined: `, client);
  Remy.guildKitchen(0);
});

/* MESSAGE RECEIVED */
DiscordClient.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const emoji = /^\p{Extended_Pictographic}/u;
  if (!emoji.test(message.content.trim())) return;

  try {
    const response = await Remy.command(message);
    if (!response) return;
    message.channel.send(response);
  } catch (error) {
    console.error(error);
    message.channel.send(`${error.message}`);
  }
});

// Connect to Discord
DiscordClient.login(token);
