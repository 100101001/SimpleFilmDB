<template>
  <div class="FilmCell" style="margin-left:3rem;margin-right:4rem">
    <p class="ul"></p>
    <table width="100%">
      <tbody>
        <tr class="item">
          <td width="100" valign="center">
            <a title class="nbg" href="javascript:void(0)" @click="Describe">
              <img width="85" alt :src="film.poster" :onerror="logo">
              <!--v-bind:src的缩写，v-on:click的缩写是@click-->
            </a>
          </td>

          <td valign="center">
            <div class="pl2">
              <!--电影海报-->
              <a title class="nbg" href="javascript:void(0)" @click="Describe">
                <!--a 使用 title 属性，可以让鼠标悬停在超链接上的时候，显示该超链接的文字注释 title=""-->
                <p style="font-size:16px;">{{film.title}}</p>
              </a>
              <!--导演、类型、简介-->
              <el-row>
                <div style="margin-bottom: 1em;float: left;text-align:justify">
                  <p>
                    <span class="pl" style="color:#909399">
                      <strong>导演：</strong>
                    </span>
                    {{directors}}
                    <br>
                    <span class="pl" style="color:#909399">
                      <strong>类型：</strong>
                    </span>
                    {{genres}}
                    <br>
                    <span class="pl" style="color:#909399">
                      <strong>简介：</strong>
                    </span>
                    <span class="pl">{{film.summary.substr(0,100)+'....'}}</span>
                  </p>
                </div>
              </el-row>

              <!--评分-->
              <!---使用el-row防止简介太短导致的评分错乱，div块貌似失效-->
              <el-row>
                <div class="star clearfix" style="margin-bottom: 1rem;">
                  <!-- 使用的element-ui星星评分组件 offset让栅格布局右移-->
                  <el-col :span="5" :offset="6">
                    <el-rate
                      style="float: right;"
                      v-model="film.rating.average/2"
                      disabled
                      text-color="#ff9900"
                    ></el-rate>
                  </el-col>
                  <!-- 10进制评分 -->
                  <el-col :span="1">
                    <span
                      class="pl"
                      style="float: left;color:#E09015"
                    >{{film.rating.average? film.rating.average:0}}分</span>
                  </el-col>
                  <!-- 评分人数 -->
                  <el-col :span="6">
                    <span
                      class="pl"
                      style="float: left;margin-left:1rem;"
                    >({{film.rating.rating_people==''? 0:film.rating.rating_people}}人评价)</span>
                  </el-col>
                </div>
              </el-row>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
function update() {
  //创建时使用父组件传过来的films，可以正常显示类别和导演，如果使用this.film就会出错
}
export default {
  name: "FilmCell",
  props: ["films"],
  data() {
    return {
      film: this.films,
      logo: 'this.src="' + require("../assets/timg.jpg") + '"',
      directors: "",
      genres: ""
    }; //重新赋值？
  },
  watch: {
    films(newValue, oldValue) {
      this.film = newValue; //监听父组件传值的变化
      //导演
      this.directors = ""; //
      this.genres = "";
      for (var i = 0, len = this.film.directors.length; i < len; i++) {
        if (len <= 5) {
          if (i == 0) {
            this.directors += this.film.directors[i]["name"];
          } else {
            this.directors += "/" + this.film.directors[i]["name"];
          }
        } else {
          if (i == 0) {
            this.directors += this.film.directors[i]["name"];
          } else if (i < 5) {
            this.directors += "/" + this.film.directors[i]["name"];
          } else if (i == 5) {
            this.directors += "/更多...";
            break;
          }
        }
      }
      //console.log(this.directors);

      //类型
      for (var i = 0, len = this.film.genres.length; i < len; i++) {
        if (len <= 5) {
          if (i == 0) {
            this.genres += this.film.genres[i];
          } else {
            this.genres += "/" + this.film.genres[i];
          }
        } else {
          if (i == 0) {
            this.genres += this.film.genres[i];
          } else if (i < 5) {
            this.genres += "/" + this.film.genres[i];
          } else if (i == 5) {
            this.genres += "/更多...";
            break;
          }
        }
      }
      // console.log(this.genres);
    }
  },
  created() {
    //console.log("created"); //子组件如果没有销毁（切换类别时，第一页第一条的导演和类型永远不变的原因），不会重调此方法
  },
  mounted() {
    //console.log("mounted"); //子组件如果没有销毁（切换类别时，第一页第一条的导演和类型永远不变的原因），不会重调此方法
  },
  methods: {
    Describe() {
      this.$parent.getDescribe(this.film, this.film._id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @import '../static/css/cell_template.css' */
.ul {
  border-bottom: 1px dashed #dddddd;
  line-height: 100%;
  clear: both;
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

.pl2 {
  font: 16px Arial, Helvetica, sans-serif;
  line-height: 150%;
  color: #666666;
}

/* .pl {
		white-space: normal;
		font-size: 13px;
	} */

.clearfix {
  display: block;
}

a {
  cursor: pointer;
  color: #37a;
  text-decoration: none;
}

.rating_nums {
  padding-left: 0;
}

.rating_nums,
.rating_num {
  color: #e09015;
  font-size: 15px;
  padding: 0 3px;
}

.pl {
  font: 15px Arial, Helvetica, sans-serif;
  line-height: 150%;
  color: #666666;
}
</style>
