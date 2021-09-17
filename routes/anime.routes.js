const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Anime = require("../models/Anime.model");
const User = require("../models/User.model");
const Episode = require("../models/Episode.model");
const Api = require("../services/ApiHandler");
const AnimeAPI = new Api();

router.get("/animes", (req, res) => {
  AnimeAPI.getAllAnimes()
    .then((allAnimes) => {
      res.render("anime/list", { animes: allAnimes.data.data });
    })
    .catch((err) => console.log(err));
});

router.get("/anime-search", (req, res) => {
  // console.log(req.query);
  const { anime } = req.query;
  AnimeAPI.getAnimeBySearch(anime).then((resultAnimes) => {
    res.render("anime/search", { animes: resultAnimes.data.data });
  });
});

router.post("/details", (req, res) => {
  AnimeAPI.getAnimeById(req.body.id).then((selAnime) => {
    res.render("anime/details", { anime: selAnime.data.data });
  });
});

router.post("/add-favorite", isLoggedIn, (req, res) => {
  const query = ({ title, jpTitle, image, status, score, apiId } = req.body);
  const idToCheck = req.body.apiId;
  Anime.find({ apiId: idToCheck }).then((animeArray) => {
    //comprobar si ese apiId ya esta en db Animes
    if (animeArray.length === 0) {
      Anime.create(query)
        .then((result) => {
          User.findByIdAndUpdate(req.user._id, {
            $push: { favorites: result._id },
          }).then(() => {
            res.redirect("/animes");
          });
        })
        .catch((err) => console.log(err));
    } else {
      User.findById(req.user._id)
        .then((user) => {
          if (!user.favorites.includes(animeArray[0]._id)) {
            User.findByIdAndUpdate(req.user._id, {
              $push: { favorites: animeArray[0]._id },
            }).then(() => {
              res.redirect("/animes");
            });
          } else {
            res.redirect("/animes");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

router.post("/delete-favorite", isLoggedIn, (req, res) => {
  const { id } = req.body;
  User.findByIdAndUpdate(req.user._id, { $pull: { favorites: id } })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => console.log(err));
});

router.get("/episodes/:id/:offset", isLoggedIn, (req, res) => {
  let paginationNext = Number(req.params.offset);
  paginationNext += 10;

  let paginationPrevious = Number(req.params.offset);
  paginationPrevious -= 10;

  const animeId = req.params.id;
  let isPrevious = paginationNext > 10 ? true : false;
  let isNext = true;

  const user = User.findById(req.user._id).populate("watchedEpisodes");

  const episodes = AnimeAPI.getAnimeEpisodes(animeId, req.params.offset);

  Promise.all([user, episodes]).then(([user, episodes]) => {
    if (episodes.data.data.length < 10) {
      isNext = false;
    }
    let episodesToView = [];
    let epiWatforId = [];

    if (!user.watchedEpisodes.length) {
      episodesToView = episodes.data.data;
    } else {
      user.watchedEpisodes.forEach((watched) => {
        if (!episodesToView.length) {
          episodesToView = episodes.data.data.filter(
            (episode) => episode.id !== watched.episodeApiId
          );
        } else {
          episodesToView = episodesToView.filter(
            (episode) => episode.id !== watched.episodeApiId
          );
        }
        // console.log(episodesToView);
      });
    }

    epiWatforId = user.watchedEpisodes.filter(
      (episode) => episode.animeApiId === animeId
    );

    console.log(epiWatforId);

    // res.send({ epiWatforId, user });
    // return;

    res.render("anime/episodes", {
      user: epiWatforId,
      episode: episodesToView,
      paginationNext: paginationNext,
      paginationPrevious: paginationPrevious,
      animeId: animeId,
      isPrevious: isPrevious,
      isNext: isNext,
    });
    // res.send({
    //   user,
    //   episode: episodesToView,
    // paginationNext: paginationNext,
    // paginationPrevious: paginationPrevious,
    // animeId: animeId,
    // isPrevious: isPrevious,
    // isNext: isNext,
    // });
  });
});

//
router.post("/add-episode", isLoggedIn, (req, res) => {
  // console.log(req.body);
  const { animeApiId, episodeApiId, episodeNumber, episodeTitle } = req.body;
  const episodeId = req.body.episodeApiId;
  // const { episodeApiId } = req.body;
  console.log(req.body);

  Episode.find({ episodeApiId: episodeId }).then((episodeArray) => {
    //comprobar si ese episodio ya esta en db Episodes
    console.log(`.find cleared`);
    if (episodeArray.length === 0) {
      Episode.create({ animeApiId, episodeApiId, episodeNumber, episodeTitle })
        .then((result) => {
          // console.log(
          //   `episode with API id ${result.episodeApiId} and chcked state ${result.checked} created`
          // );
          // console.log(req.user._id);
          User.findByIdAndUpdate(req.user._id, {
            $push: { watchedEpisodes: result._id },
          }).then(() => {
            res.status(200);
          });
        })
        .catch((err) => console.log(err));
    } else {
      User.findById(req.user._id)
        .then((user) => {
          if (!user.watchedEpisodes.includes(episodeArray[0]._id)) {
            User.findByIdAndUpdate(req.user._id, {
              $push: { watchedEpisodes: episodeArray[0]._id },
            }).then(() => {
              res.status(200);
            });
          } else {
            res.res.status(200);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = router;
