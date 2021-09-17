const allCheckBox = document.querySelectorAll(".watchedEpisode");

class Episodes {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:3000",
    });
  }

  postEpisodes = (animeApiId, episodeApiId, episodeNumber, episodeTitle) =>
    this.api.post("/add-episode", {
      animeApiId,
      episodeApiId,
      episodeNumber,
      episodeTitle,
    });
}

window.onload = function () {
  const Episode = new Episodes();
  allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener("click", (e) => {
      const allInputsInEpisode = e.currentTarget.parentNode;
      // console.log(allInputsInEpisode);

      const episodeInfo =
        allInputsInEpisode.querySelectorAll(".watchedEpisodes");
      console.log(episodeInfo);
      // episodeInfo.forEach((episode) => {
      //   console.log(episode.value);
      // });
      const episodeApiId = episodeInfo[0].value;
      const episodeNumber = episodeInfo[1].value;
      const episodeTitle = episodeInfo[2].value;
      const animeApiId = episodeInfo[3].value;
      console.log(animeApiId, episodeApiId, episodeNumber, episodeTitle);

      Episode.postEpisodes(
        animeApiId,
        episodeApiId,
        episodeNumber,
        episodeTitle
      );

      // checkBox.value;

      // console.log(checkBox.value);
      // console.log(checkBox.checked);
      // Episode.postEpisodes(checkBox.value, checkBox.checked);
    });
  });
};
