const allCheckBox = document.querySelectorAll(".watchedEpisode");

class Episodes {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:4000",
    });
  }

  postEpisodes = (episodeApiId, checked) =>
    this.api.post("/add-episode", { episodeApiId, checked });
}

window.onload = function () {
  const Episode = new Episodes();
  allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener("click", (e) => {
      checkBox.value;
      console.log(checkBox.value);
      console.log(checkBox.checked);
      Episode.postEpisodes(checkBox.value, checkBox.checked);
    });
  });
};
