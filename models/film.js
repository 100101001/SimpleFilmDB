const mongoose = require("mongoose");
//mongoose.connect("mongodb://39.108.116.254/film", { useNewUrlParser: true });
mongoose.connect("mongodb://127.0.0.1/film", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we are connected!");
});

const filmSchema = mongoose.Schema(
  {
    _id: String,
    directors: [
      {
        name: String,
        id: String
      }
    ],
    genres: [String],
    season_count: String,
    rating: {
      average: String,
      rating_people: String,
      stars: [String]
    },
    pubdate: [String],
    countries: [String],
    lens_id: Number,
    casts: [
      {
        name: String,
        id: String
      }
    ],
    title: String,
    site: String,
    poster: String,
    summary: String,
    languages: [String],
    episodes: String,
    writers: [
      {
        name: String,
        id: String
      }
    ],
    imdb: String,
    year: String,
    duration: String,
    douban_site: String,
    aka: [String]
  },
  { collection: "films_all" }
);

const film = (module.exports.film = mongoose.model("film", filmSchema));
