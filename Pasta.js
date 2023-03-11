// Write prefixes
const write = ["🖊️", "🖋️", "🔏", "📝", "✏️", "✍️", "💾"];

// Image prefixes
const image = ["📷", "📸", "🎥", "📹", "📺"];

// Read prefixes
const read = [
  "🍝",
  "📎",
  "🖇️",
  "📰",
  "🗞️",
  "🧻",
  "📏",
  "📐",
  "🔎",
  "🔍",
  "📜",
  "📃",
  "📄",
  "📑",
  "🧾",
  "📊",
  "📈",
  "📉",
  "🗒️",
  "📇,",
  "🗃️",
  "🗳️",
  "🗄️",
  "📋",
  "📁",
  "📂",
  "🗂️",
  "🗞️",
  "📓",
  "📔",
  "📒",
  "📕",
  "📗",
  "📘",
  "📙",
  "📚",
  "📖",
  "🔖",
];

// Lock prefixes
const lock = ["🔒", "🔏", "🔐"];
const unlock = ["🔓"];

// Removal prefixes
const customBoom = "<a:boom:1077731685241720883>";
const carpentrySaw = "🪚";
const remove = [
  "🧊",
  "🚽",
  "🚫",
  "⛔",
  "🗑️",
  "😡",
  "🤬",
  "💀",
  "🪓",
  "🔪",
  "🗡️",
  "⚔️",
  "⛏️",
  "🛠️",
  "⚒️",
  "🔨",
  "❎",
  "✖️",
  "➖",
  "🔚",
  "🔇",
  carpentrySaw,
  customBoom,
];

const Commands = {
  Cook: "cook",
  Image: "image",
  Post: "post",
  Eat: "eat",
};

const fs = require("fs");
const { access, writeFile, readFile } = fs.promises;
const { constants } = require("fs");
const { join } = require("path");

const kitchens = join(__dirname, "kitchen");

// TODO: Build kitchens here

class Chef {
  guilds = [];
  ready = false;

  constructor() {
    const guilds = fs.readdirSync(kitchens);
    this.guilds = guilds;
    this.ready = true;
  }

  guildKitchen(guildId) {
    const guildKitchenPath = join(kitchens, guildId);
    console.log(`TODO: Make new kitchen folder!`);
    return guildKitchenPath;
  }

  static kitchenPath(guildId) {
    return join(kitchens, guildId);
  }

  static pastaPath(kitchen, pasta) {
    const kitchenPath = Chef.kitchenPath(kitchen);
    return join(kitchenPath, pasta.name) + ".json";
  }

  async pastaToFile(kitchen, pasta) {
    const kitchenPath = Chef.kitchenPath(kitchen);
    await access(kitchenPath, constants.W_OK);
    await writeFile(Chef.pastaPath(kitchen, pasta), JSON.stringify(pasta));
  }

  async pastaFromFile(kitchen, name) {
    const fileContent = await readFile(Chef.pastaPath(kitchen, { name }));
    return JSON.parse(fileContent);
  }

  prefixToCommand(prefix) {
    console.log(`prefixToCommand(${prefix})`);
    // TODO: Make hashtable that contains all the prefixes at startup
    if (read.includes(prefix)) return Commands.Post;
    if (write.includes(prefix)) return Commands.Cook;
    if (image.includes(prefix)) return Commands.Image;
    if (remove.includes(prefix)) return Commands.Eat;
    return false;
  }

  async command(message) {
    const {
      guildId,
      author: { id: user },
    } = message;

    const lines = message.content.trim().split(/\n/);
    const firstLine = lines[0];

    const emoji = /^.*?(?=[\w|\s]|$)/u;
    const [first] = firstLine.match(emoji);
    const restOfFirstLine = `${firstLine}`.slice(first.length);
    const [name, ...stuff] = restOfFirstLine.trim().split(/\s/);
    const content = stuff.join(" ") + lines.slice(1).join("\n");

    const command = this.prefixToCommand(first);

    switch (command) {
      case Commands.Post: {
        const pasta = await this.pastaFromFile(guildId, name);
        return { embeds: [pasta] };
      }
      case Commands.Cook: {
        const pasta = {
          name,
          user,
          title: name,
          locked: false,
          description: content,
        };
        await this.pastaToFile(guildId, pasta);
        return `Saved ${name}!`;
      }
      case Commands.Eat: {
        return "Nom nom nom!";
      }
      case Commands.Lock: {
        // TODO: implement Commands.Lock
        return `Toggled the lock on ${name}!`;
      }
      case Commands.Image: {
        return "Snap! This is going in my pasta compilation!";
      }
      default: {
        return false;
      }
    }
  }
}

module.exports = { Commands, Chef };
