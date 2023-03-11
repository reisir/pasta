const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    guildId: { type: String, required: true, ref: "guild" },
    userId: { type: String, required: true, ref: "user" },
    locked: { type: Boolean, default: false },

    // Actual content
    title: String,
    description: String,
    image: { url: String },
    // author: {
    //   name: String,
    //   icon_url: String,
    //   url: String,
    // },
    // footer: {
    //     text: String,
    //     icon_url: String,
    //   },
  },
  { timestamps: true, collection: "pastas" }
);

mongoose.model("pasta", Schema);
