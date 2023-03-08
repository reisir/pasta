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

const splitter = /[\s|\n]/;

const fs = require("fs");
const { access, writeFile, readFile } = fs.promises;
const { constants } = require("fs");
const { join } = require("path");

const kitchens = join(__dirname, "kitchen");

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

  static pastaPath(pasta) {
    const kitchen = Chef.kitchenPath(pasta.kitchen);
    return join(kitchen, pasta.name) + ".json";
  }

  async toFile(pasta) {
    const kitchen = Chef.kitchenPath(pasta.kitchen);
    await access(kitchen, constants.W_OK);
    await writeFile(Chef.pastaPath(pasta), JSON.stringify(pasta));
  }

  async fromFile(kitchen, name) {
    const fileContent = await readFile(Chef.pastaPath({ kitchen, name }));
    return JSON.parse(fileContent);
  }

  command({ content }) {
    const prefix = content.trim().split(splitter)[0];
    if (read.includes(prefix)) return Commands.Post;
    if (write.includes(prefix)) return Commands.Cook;
    if (image.includes(prefix)) return Commands.Image;
    if (remove.includes(prefix)) return Commands.Eat;
    return false;
  }
}

module.exports = { Commands, Chef };
