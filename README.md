# Pasta

A discord bot for managing copypasta. [Invite Pasta](https://discord.com/api/oauth2/authorize?client_id=1082801178930327613&permissions=274878196736&scope=bot) today!

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
