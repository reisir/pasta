const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    _id: { type: String },
    ignoredEmojis: [String],
  },
  { timestamps: true, collection: "users" }
);

mongoose.model("user", Schema);
