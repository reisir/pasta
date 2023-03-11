const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    _id: { type: String },
    mutedChannels: [String],
    allowedChannels: [String],
  },
  { timestamps: true, collection: "guilds" }
);

mongoose.model("guild", Schema);
