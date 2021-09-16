const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const episodeSchema = new Schema(
  {
    episodeApiId: String,
  },
  {
    timestamps: true,
  }
);

const Episode = model("Episode", episodeSchema);

module.exports = Episode;
