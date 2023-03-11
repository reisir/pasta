require("dotenv/config");
const fs = require("fs");
const { join } = require("path");
const { token, MONGO_URL } = process.env;

// Database connection
const mongoose = require("mongoose");
mongoose.connect(MONGO_URL).then(() => console.log(`Connected to MongoDB!`));
process.on("SIGKILL", () => mongoose.disconnect());

// Load models
const models = join(__dirname, "models");
fs.readdirSync(models).forEach((file) => {
  require(join(models, file));
});

// Create the Chef instance
const { Commands, Chef } = require("./Pasta");
const Remy = new Chef();

// New client, ask for permissions
const { Client, Events, GatewayIntentBits } = require("discord.js");
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
