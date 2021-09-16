class Episodes {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:4000",
    });
  }

  postEpisodes = (episodeApiId, checked) =>
    this.app.post("/add-episode", { episodeApiId, checked });
}
