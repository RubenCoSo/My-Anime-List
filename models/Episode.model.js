const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const episodeSchema = new Schema(
  {
    animeApiId: String,
    episodeApiId: String,
    episodeNumber: String,
    episodeTitle: String,
    checked: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Episode", episodeSchema);
