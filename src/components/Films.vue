<template>
  <div class="films">
    <!-- 标语 -->
    <header style="margin-bottom=1rem">
      <h1>CHECK YOUR FAVORITE FILM AT SIMPLE FILM</h1>
    </header>

    <!-- 搜索栏 -->
    <nav>
      <el-row>
        <el-col :span="5" :offset="10">
          <el-input
            style="float:right"
            v-model="filmTitle"
            placeholder="请输入电影名"
            @keyup.enter.native="searchBytitle"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            style="float:left;margin-left:1rem"
            icon="el-icon-search"
            circle
            @click="searchBytitle"
          ></el-button>
        </el-col>
      </el-row>
    </nav>
    <!--电影类别-->

    <el-tabs v-model="activeName" type="card" @tab-click="changeGenre" style="margin-top:25px;">
      <el-tab-pane
        v-for="item in genres"
        :key="item"
        :label="item"
        :name="index"
        style="font-size: 20px;"
      ></el-tab-pane>
    </el-tabs>

    <!-- 电影列表 -->
    <FilmCell v-for="item in currentFilms" :key="item" :films="item" @click="getDescribe()"></FilmCell>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 1rem;"
      @current-change="handleCurrentChange"
      :page-size="10"
      :current-page="currentPage"
      background
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";

import FilmCell from "./FilmCell";
import Describe from "./FilmCellDetail";

Array.prototype.clean = function(deleteValue) {
  for (var i = 0, len = this.length; i < len; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--; //后一个前删掉了一个，因此回退
    }
  }
  return this;
};

export default {
  name: "App",
  components: {
    FilmCell
  },
  data() {
    return {
      films: "",
      currentPage: 1,
      filmTitle: "",
      currentFilms: [],
      activeName: "0",
      genres: [],
      films_genre: "",
      total: 200
    };
  },
  created: function() {
    //获取某一页的电影数据
    axios.get("/api/film/1").then(res => {
      //console.log(res);
      this.films = res.data;
      this.currentFilms = this.films;
    });

    //获取电影类别
    axios.get("/api/category").then(res => {
      console.log(res);
      this.genres = res.data.clean("");
    });

    //获取某一类别的数据
  },
  mounted: function() {},
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.currentFilms = this.films_genre.slice(
        10 * (this.currentPage - 1),
        10 * this.currentPage
      );
    },
    getDescribe(film, id) {
      this.$router.push({
        name: "Describe",
        params: {
          id: id,
          film: film
        }
      });
    },
    searchBytitle() {
      //this.filmTitle;
      //console.log(JSON.parse(this.films[1]).aka[0].indexOf('要命的决定'))
      //console.log(JSON.parse(this.films[1]).aka[0])
      if (!this.filmTitle) {
        this.activeName = "0";
        this.total = this.films.length;
        this.currentPage = 1;
        this.films_genre = this.films;
        this.currentFilms = this.films_genre.slice(
          10 * (this.currentPage - 1),
          10 * this.currentPage
        );
      }
      var searchResult = [];
      var input = this.filmTitle.trim().toUpperCase();
      for (var i = 0, len = this.films.length; i < len; i++) {
        var film = JSON.parse(this.films[i]);
        if (film.title != null) {
          var s = film.title.trim().toUpperCase();

          if (s.indexOf(input) != -1) {
            searchResult.push(this.films[i]);
            continue;
          }
        }
        for (var j = 0, len2 = film.aka.length; j < len2; j++) {
          if (film.aka[j]) {
            var s = film.aka[j].trim().toUpperCase();
            if (s.indexOf(input) != -1) {
              searchResult.push(this.films[i]);
              break;
            }
          }
        }
      }
      //console.log(searchResult);
      this.activeName = "0";
      this.total = searchResult.length;
      this.currentPage = 1;
      this.films_genre = searchResult;
      this.currentFilms = searchResult.slice(
        10 * (this.currentPage - 1),
        10 * this.currentPage
      );
    },
    changeGenre(tab, event) {
      this.activeName = tab.index;
      //如果点到了所有
      if (tab.index == "0") {
        //重新设置页面参数和电影参数为全体films
        this.films_genre = this.films;
        this.currentPage = 1;
        this.currentFilms = this.films_genre.slice(
          10 * (this.currentPage - 1),
          10 * this.currentPage
        );
        this.total = this.films.length;
      } else {
        //搜索设置电影参数和页面参数
        var searchResult = [];
        var input = this.genres[tab.index];
        //console.log(tab);

        for (var i = 0, len = this.films.length; i < len; i++) {
          var film = JSON.parse(this.films[i]);
          var genres = film.genres;
          //console.log(genres);
          //console.log(input);

          //console.log(genres.indexOf(input));
          if (genres.indexOf(input) != -1) {
            searchResult.push(this.films[i]);
          }
        }

        this.total = searchResult.length;
        this.films_genre = searchResult;
        //console.log(searchResult.length);
        this.currentPage = 1;
        this.currentFilms = this.films_genre.slice(
          10 * (this.currentPage - 1),
          10 * this.currentPage
        );
      }
    }
  }
};
</script>

<style>
.films {
  padding-left: 50px;
  padding-right: 50px;
}
.nav-search .inp input {
  background: #fff;

  width: 96%;
  margin: 0;
  text-align: left;
  height: 30px;
  padding-left: 10px;
  height: 28px\9;
  line-height: 28px\9;
  outline: none;
}
</style>
