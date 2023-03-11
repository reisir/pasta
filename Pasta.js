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
const unlock = ["🔓", "🔑", "🗝️"];

// Removal prefixes
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
];

// Title prefixes
const titles = ["🆙", "🔼", "⏫", "⤴️", "⬆️", "👆", "☝️", "↖️", "↗️"];

// JSON prefixes
const raw = ["💻", "🖥️"];

const Commands = {
  Cook: "cook",
  Image: "image",
  Post: "post",
  Eat: "eat",
  Lock: "lock",
  Unlock: "unlock",
  Nerd: "nerd",
  Title: "title",
};

// Models
const mongoose = require("mongoose");
const Pasta = mongoose.model("pasta");
const Guild = mongoose.model("guild");
const User = mongoose.model("user");

function asJSONcodeblock(o) {
  let block = "```json\n";
  block += JSON.stringify(o, null, 2);
  block += "```";
  return block;
}

class Chef {
  constructor() {}

  prefixToCommand(prefix) {
    console.log(`prefixToCommand(${prefix})`);
    // TODO: Make hashtable that contains all the prefixes at startup
    if (read.includes(prefix)) return Commands.Post;
    if (write.includes(prefix)) return Commands.Cook;
    if (image.includes(prefix)) return Commands.Image;
    if (remove.includes(prefix)) return Commands.Eat;
    if (lock.includes(prefix)) return Commands.Lock;
    if (unlock.includes(prefix)) return Commands.Unlock;
    if (raw.includes(prefix)) return Commands.Nerd;
    if (titles.includes(prefix)) return Commands.Title;
    return false;
  }

  async command(message) {
    const {
      guildId,
      author: { id: userId },
    } = message;

    const lines = message.content.trim().split(/\n/);
    const firstLine = lines[0];

    const emoji = /^.*?(?=[\w|\s]|$)/u;
    const [first] = firstLine.match(emoji);
    const restOfFirstLine = `${firstLine}`.slice(first.length);
    const [name, ...stuff] = restOfFirstLine.trim().split(/\s/);
    const content = stuff.join(" ") + lines.slice(1).join("\n");
    const command = this.prefixToCommand(first);
    const filter = { name, guildId, userId };

    console.log({ filter, content });

    switch (command) {
      case Commands.Post: {
        const pasta = await Pasta.findOne({ guildId, name }).lean();
        if (!pasta) return;

        // Hide title if it's not custom and if there's no other content than an image
        if (
          pasta.name.toLowerCase() === pasta.title.toLowerCase() &&
          !pasta.description &&
          pasta?.image?.url
        ) {
          pasta.title = "";
        }

        return { embeds: [pasta] };
      }
      case Commands.Cook: {
        const pasta = { description: content };

        const pastaExists = await Pasta.exists({ filter });
        if (!pastaExists) pasta = { ...pasta, ...filter, title: pasta.name };

        await Pasta.findOneAndUpdate(filter, pasta, {
          upsert: true,
        }).lean();
        return `Saved ${name}!`;
      }
      case Commands.Eat: {
        const deleted = await Pasta.findOneAndDelete(filter).lean();
        return `Nom nom nom!\n${asJSONcodeblock(deleted)}`;
      }
      case Commands.Lock: {
        await Pasta.findOneAndUpdate(filter, { locked: true }).lean();
        return `Locked ${name}!`;
      }
      case Commands.Unlock: {
        await Pasta.findOneAndUpdate(filter, { locked: false }).lean();
        return `Unlocked ${name}!`;
      }
      case Commands.Image: {
        const matches = content.trim().match(/^<?(.*?)(?=>|$)/);
        const { href: url } = new URL(matches[1]);
        await Pasta.findOneAndUpdate(
          filter,
          { image: { url } },
          { upsert: true }
        ).lean();
        return `Added <${url}> to ${name}`;
      }
      case Commands.Title: {
        const pasta = await Pasta.findOneAndUpdate(
          filter,
          { title: content },
          { new: true }
        );
        return `Set the title of ${name} as ${pasta.title}`;
      }
      case Commands.Nerd: {
        const pasta = await Pasta.findOne({ guildId, name }).lean();
        if (!pasta) return;
        return { embeds: [{ description: asJSONcodeblock(pasta) }] };
      }
      default: {
        return false;
      }
    }
  }
}

module.exports = { Commands, Chef };
