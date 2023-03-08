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

  const { content, channel, guildId } = message;
  const [first, ...command] = content.trim().split(" ");

  const prefix = /^\p{Extended_Pictographic}/u;
  if (!prefix.test(first)) return message.channel.send("Not a command!");

  // Handle commands!
  switch (Remy.command(message)) {
    case Commands.Post: {
      console.log("Posting!");
      const name = command[0];
      try {
        const pasta = await Remy.fromFile(guildId, name);
        channel.send({ embeds: [pasta] });
      } catch (error) {
        console.log(error);
        channel.send(`${name} doesn't exist :/`);
      }
      break;
    }
    case Commands.Cook: {
      console.log("Cooking!");
      const [name, ...food] = command;
      try {
        const pasta = {
          kitchen: guildId,
          name,
          title: name,
          description: food.join(" "),
        };
        await Remy.toFile(pasta);
        channel.send(`Saved ${name}!`);
      } catch (error) {
        console.log(error);
        channel.send(`${name} doesn't exist :/`);
      }
      break;
    }
    case Commands.Eat: {
      console.log("Eating!");
      return channel.send("Nom nom nom!");
    }
    case Commands.Image: {
      return channel.send("Snap! This is going in my pasta compilation!");
    }
    default: {
      return channel.send("Not a command!");
    }
  }
});

// Connect to Discord
DiscordClient.login(token);
