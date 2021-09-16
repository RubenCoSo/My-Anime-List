const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Anime = require("../models/Anime.model");
const User = require("../models/User.model");
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

// router.post("/episodes", (req, res) => {
//   const { id } = req.body;

//   let offset = 0;

//   AnimeAPI.getAnimeEpisodes(id, offset).then((episodes) => {
//     res.render("anime/episodes", {
//       episode: episodes.data.data,
//       offset: 0,
//       animeId: id,
//     });
//   });
// });

router.get("/episodes/:id/:offset", (req, res) => {
  let paginationNext = Number(req.params.offset);
  paginationNext += 10;

  let paginationPrevious = Number(req.params.offset);
  paginationPrevious -= 10;

  const animeId = req.params.id;
  let isPrevious = paginationNext > 10 ? true : false;
  let isNext = true;

  AnimeAPI.getAnimeEpisodes(animeId, req.params.offset).then((episodes) => {
    if (episodes.data.data.length < 10) {
      isNext = false;
    }
    res.render("anime/episodes", {
      episode: episodes.data.data,
      paginationNext: paginationNext,
      paginationPrevious: paginationPrevious,
      animeId: animeId,
      isPrevious: isPrevious,
      isNext: isNext,
    });
  });
});

// router.get("/episodes/previous/:id/:offset", (req, res) => {
//   let paginationPrevious = Number(req.params.offset);
//   paginationPrevious -= 10;
//   const animeId = req.params.id;
//   let isPreviousTrue = paginationPrevious > 10 ? true : false;
//   let isNextTrue = true;

//   AnimeAPI.getAnimeEpisodes(animeId, req.params.offset).then((episodes) => {
//     if (episodes.data.data.length < 10) {
//       isNextTrue = false;
//     }
//     res.render("anime/episodes", {
//       episode: episodes.data.data,
//       paginationPrevious: paginationPrevious,
//       animeId: animeId,
//       isPreviousTrue: isPreviousTrue,
//       isNextTrue: isNextTrue,
//     });
//   });
// });

// router.get("/episodes/id/:offset", (req, res) => {
//   let pagination = Number(req.params.offset);
//   pagination += 10;
//   const animeId = req.params.id;

//   AnimeAPI.getAnimeEpisodes(animeId, pagination).then((episodes) => {
//     return res.render("anime/episodes", {
//       episode: episodes.data.data,
//       pagination: pagination,
//     });
//   });
// });

//  * ---arrays
// { field: { $in: [ value1, value2, ..... , valueN ] } }
// { field: { $nin: [ value1, value2, ..... , valueN ] } }
// { field: { $all: [ value1, value2, ..... , valueN ] } }
//  */

module.exports = router;
