# Pasta

A discord bot for managing copypasta. [Invite Pasta](https://discord.com/api/oauth2/authorize?client_id=1082801178930327613&permissions=274878196736&scope=bot) today!

# TODO:

- Image commands for adding embed image
- The color commands for changing embed strip
- Store guild information
  - Guild { mutedChannels: [], allowedChannels: [] }
  - Can only trigger pasta commands (other than posting) in the pastaChannel
  - Only admins can set allowed channels
- Admin commands
  - `🍝 channel` sets pastaChannel
  - `🍝 channels` print channel information
  - `🍝 mute` no pasta in current channel
- Make pasta lockable / unlockable (only owner / admin can edit)
  - `🔒 <name>` locks pasta
  - `🔓 <name>` unlocks pasta
- Make `🍝` multi-use
  - `🍝` lists help
  - `🍝 all` lists all pasta
  - `🍝 <name>` posts pasta
  - `🍝 <name> <content>` edits pasta
- Store user information
  - User { ignoreEmojis: ["💀"] }
- Stealth commands `["🥷", "🕴️"]`
- Handle custom emotes `<a::>` => `<::>`

# Commands

## Write pasta

<pre><code>🖊️ &lt;name&gt;
your copypasta content!!!
can include markdown [links](https://pasta.amv.tools) and *funky* __formatting__

even code for nerds!!!

```
ur code
```</code></pre>

## Add image to your pasta

```
📸 <name>
```

## Post your pasta

```
🍝 <name>
```

## Get a list of all pastas

```
🍝 all
```

# List of useful links

Discord dev embed doc: https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure

Invite Pasta: https://discord.com/api/oauth2/authorize?client_id=1082801178930327613&permissions=274878196736&scope=bot

```js
const exampleEmbed = {
  color: 0x0099ff,
  title: "Some title",
  url: "https://discord.js.org",
  author: {
    name: "Some name",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  },
  description: "Some description here",
  thumbnail: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  fields: [
    {
      name: "Regular field title",
      value: "Some value here",
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
  ],
  image: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  timestamp: new Date().toISOString(),
  footer: {
    text: "Some footer text here",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
  },
};
```
