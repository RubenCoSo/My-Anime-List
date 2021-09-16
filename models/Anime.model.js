const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const animeSchema = new Schema(
  {
    title: String,
    jpTitle: String,
    image: String,
    status: String,
    score: String,
    apiId: String,
  },
  {
    timestamps: true,
  }
);

// const anime = model("Anime, userSchema);

module.exports = model("Anime", animeSchema);
