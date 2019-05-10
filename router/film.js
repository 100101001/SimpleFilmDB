const express = require("express");

const router = express.Router();

const mongo = require("../models/film");

const film = mongo.film;

const pageSize = 10;

router.get("/film/:page", (req, res) => {
  film
    .find({})
    .skip((parseInt(req.params.page) - 1) * pageSize)
    .limit(pageSize)
    .then(films => {
      res.json(films);
    })
    .catch(error => {
      console.log(2);
      res.json(error);
    });
});

router.get("/category", (req, res) => {
  film.distinct("genres").then(genres => {
    res.json(genres);
  });
});
module.exports = router;
