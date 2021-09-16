// service/index.js
const axios = require("axios");

class AnimeAPI {
  constructor() {
    this.api = axios.create({
      baseURL: "https://kitsu.io/api/edge",
    });
  }

  getAllAnimes = () => this.api.get("/anime");
  getAnimeById = (id) => this.api.get(`/anime/${id}`);
  getAnimeEpisodes = (id, offset) =>
    this.api.get(`/anime/${id}/episodes?page[offset]=${offset}`);
  getAnimeBySearch = (anime) =>
    this.api.get(`/anime?filter[text]=${anime}&page[limit]=20&page[offset]=0`);
}

// /anime?page[limit]=5&page[offset]=0

module.exports = AnimeAPI;
