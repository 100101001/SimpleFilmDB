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
    <!--key显示值，label是key-->
    <el-tabs v-model="activeName" type="card" @tab-click="changeGenre" style="margin-top:25px;">
      <el-tab-pane
        v-for="(item,index) in genres"
        :key="index"
        :label="item"
        :name="item"
        style="font-size: 20px;"
      ></el-tab-pane>
    </el-tabs>

    <!-- 电影列表 -->
    <FilmCell
      v-for="(item,index) in currentFilms"
      :key="index"
      :films="item"
      @click="getDescribe()"
    ></FilmCell>

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
      FilmNum: {}, //某一类别总共有多少部电影
      currentPage: 1, //分页组件当前页
      filmTitle: "", //搜索栏
      currentFilms: [], //当前页面显示的电影
      activeName: "", //类别标签栏选中
      genres: [], //类别标签栏的类别数组数据
      total: 0, //当前搜索或切换类别标签对total的更改，当类别是所有的时候total是10000
      genre: "所有",
      searching: false,
      searchingTitle: ""
    };
  },
  //创建钩子
  created: function() {
    //获取所有类别第一页的电影数据
    axios.get("/api/film/1").then(res => {
      //console.log(res);
      this.currentFilms = res.data;
      //console.log(this.currentFilms);
    });

    //每次切类别首页都要计算该类别有多少电影?
    axios.post("/api/genreCount", { category: this.genre }).then(res => {
      this.FilmNum["所有"] = res.data;
      //分页组件初始化
      this.total = res.data;
      // console.log(res.data);
      this.currentPage = 1;
    });

    //获取所有电影类别
    axios.get("/api/getAllGenres").then(res => {
      //console.log(res);
      //tab组件初始化
      this.genres = res.data.clean("");
      this.genres.splice(0, 0, "所有");
      this.activeName = "0";
      this.genre = "所有";
    });
  },
  mounted: function() {},
  methods: {
    //修改Array(200)的slice为api请求
    //用户择页
    handleCurrentChange(val) {
      if (this.genre === "所有") {
        if (searching) {
          axios
            .post("/api/search", {
              input: this.searchingTitle,
              category: this.genre,
              page: val,
              count: false
            }) //需要返回搜索记录总数
            .then(res => {
              console.log(res);
              this.currentFilms = res.data.films;
            });
        }
        //不支持类别域的分页接口
        axios.get("/api/film/" + val).then(res => {
          //console.log(res);
          this.currentFilms = res.data;
          //console.log("changepage");
          //console.log(this.currentFilms);
        });
      } else {
        //支持类别域的分页接口
        axios
          .post("/api/film/genre", { category: this.genre, page: val })
          .then(res => {
            this.currentFilms = res.data;
          });
      }
      //分页组件
      this.currentPage = val;
      //this.total = this.currentFilms.length;
    },
    //点击进入详情页
    getDescribe(film, id) {
      this.$router.push({
        name: "Describe",
        params: {
          id: id,
          film: film
        }
      });
    },
    //搜索栏搜索
    searchBytitle() {
      var input = this.filmTitle;
      //搜索栏空,切换至第一页，标签栏类别所有
      if (!this.filmTitle) {
        //类别标签栏
        this.genre = "所有";
        this.activeName = this.genre;
        //分页组件
        this.total = this.FilmNum[this.genre];
        this.currentPage = 1;
        axios.get("/api/film/1").then(res => {
          //console.log(res);
          this.currentFilms = res.data;
        });
        return;
      }

      //搜索栏非空,以类别和电影名双域模糊查找
      axios
        .post("/api/search", {
          input: input,
          category: this.genre,
          page: 1,
          count: true
        }) //需要返回搜索记录总数
        .then(res => {
          console.log(res);
          this.currentFilms = res.data.films;
          //分页组件
          this.total = res.data.count;
          this.currentPage = 1;

          //设置搜索变量，分页API
          this.searching = true;
          this.searchingTitle = this.filmTitle;
        });
    },
    //点击类别标签栏
    changeGenre(tab, event) {
      this.searching = false;
      //类别组件
      //索引(String)
      console.log("选中了第几个类别标签？");
      console.log(tab.index);
      //获取当前类别
      this.genre = this.genres[tab.index];
      this.activeName = this.genre;
      console.log("激活的名字是？");
      console.log(this.genre);

      this.currentPage = 1;
      //获取各类别的首页数据
      if (tab.index == "0") {
        this.total = this.FilmNum[this.genre];
        axios.get("/api/film/1").then(res => {
          //console.log(res);
          this.currentFilms = res.data;
        });
      } else {
        this.total = this.FilmNum[this.genre];
        axios
          .post("/api/film/genre", { category: this.genre, page: 1 })
          .then(res => {
            this.currentFilms = res.data;
          });
      }

      //如果该类缺少总数数据
      if (!this.FilmNum.hasOwnProperty(this.genre)) {
        axios.post("/api/genreCount", { category: this.genre }).then(res => {
          this.FilmNum[this.genre] = res.data;
          //分页组件类别数据初始化
          this.total = res.data;
          console.log("该类别下总共有多少部电影？");
          console.log(this.total);
        });
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
