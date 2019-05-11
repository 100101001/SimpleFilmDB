const express = require("express");

const router = express.Router();

var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
//给所有的访问的req对象添加一个body属性，req.body是一个json对象，包含了post请求参数。
//bodyParser.urlencoded({ extended: false })的返回值是一个函数 next

const mongo = require("../models/film");

const film = mongo.film;

const pageSize = 10;

//分页无类别
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
//带类别分页
router.post("/film/genre", jsonParser, (req, res) => {
  var page = req.body.page;
  var genre = req.body.category;
  film
    .find({ genres: genre })
    .skip((parseInt(page) - 1) * pageSize)
    .limit(pageSize)
    .then(films => {
      res.json(films);
    });
});

//获取所有类别
router.get("/getAllGenres", (req, res) => {
  film.distinct("genres").then(genres => {
    res.json(genres);
  });
});

//带类别搜索电影
router.post("/search", jsonParser, (req, res) => {
  var category = req.body.category;
  var input = req.body.input;
  var page = req.body.page;
  var needCount = req.body.count;
  var filmRes = [];
  var count = 0;
  if (category === "所有") {
    //`===` 严格相等，会比较两个值的类型和值
    // `==`  抽象相等，比较时，会先进行类型转换，然后再比较值

    //搜索所有类别模糊标题分页
    film
      .find({
        $or: [{ aka: { $regex: input } }, { title: { $regex: input } }]
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(films => {
        filmRes = films;
      })
      .then(() => {
        if (needCount) {
          film
            .find({
              $or: [{ aka: { $regex: input } }, { title: { $regex: input } }]
            })
            .count()
            .then(cnt => {
              let result = {
                films: filmRes,
                count: cnt
              };
              res.json(result);
            });
        } else {
          //直接返回
          let result = {
            films: filmRes,
            count: count
          };
          res.json(result);
        }
      });
    //搜索所有数量
  } else {
    //搜索分页
    film
      .find({ genres: category })
      .find({
        $or: [{ aka: { $regex: input } }, { title: { $regex: input } }]
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(films => {
        filmRes = films;
      })
      .then(() => {
        //搜索数量
        if (needCount) {
          film
            .find({ genres: category })
            .find({
              $or: [{ aka: { $regex: input } }, { title: { $regex: input } }]
            })
            .count()
            .then(cnt => {
              let result = {
                films: filmRes,
                count: count
              };
              res.json(result);
            });
        } else {
          //直接返回
          let result = {
            films: filmRes,
            count: count
          };
          res.json(result);
        }
      });
  }
});

//每个类别对应的电影数
router.post("/genreCount", jsonParser, (req, res) => {
  if (req.body.category === "所有") {
    film.count().then(count => {
      res.json(count);
    });
  } else {
    film
      .find({ genres: req.body.category })
      .count()
      .then(count => {
        res.json(count);
      });
  }
});
module.exports = router;
