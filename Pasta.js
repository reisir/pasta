// Write prefixes
const write = ["๐๏ธ", "๐๏ธ", "๐", "๐", "โ๏ธ", "โ๏ธ", "๐พ"];

// Image prefixes
const image = ["๐ท", "๐ธ", "๐ฅ", "๐น", "๐บ"];

// Read prefixes
const read = [
  "๐",
  "๐",
  "๐๏ธ",
  "๐ฐ",
  "๐๏ธ",
  "๐งป",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐งพ",
  "๐",
  "๐",
  "๐",
  "๐๏ธ",
  "๐,",
  "๐๏ธ",
  "๐ณ๏ธ",
  "๐๏ธ",
  "๐",
  "๐",
  "๐",
  "๐๏ธ",
  "๐๏ธ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
];

// Lock prefixes
const lock = ["๐", "๐", "๐"];
const unlock = ["๐", "๐", "๐๏ธ"];

// Removal prefixes
const carpentrySaw = "๐ช";
const remove = [
  "๐ง",
  "๐ฝ",
  "๐ซ",
  "โ",
  "๐๏ธ",
  "๐ก",
  "๐คฌ",
  "๐",
  "๐ช",
  "๐ช",
  "๐ก๏ธ",
  "โ๏ธ",
  "โ๏ธ",
  "๐ ๏ธ",
  "โ๏ธ",
  "๐จ",
  "โ",
  "โ๏ธ",
  "โ",
  "๐",
  "๐",
  carpentrySaw,
];

// Title prefixes
const titles = ["๐", "๐ผ", "โซ", "โคด๏ธ", "โฌ๏ธ", "๐", "โ๏ธ", "โ๏ธ", "โ๏ธ"];

// JSON prefixes
const raw = ["๐ป", "๐ฅ๏ธ"];

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
