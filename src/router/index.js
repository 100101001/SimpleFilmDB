import Vue from "vue";
import Router from "vue-router";
import Films from "@/components/Films";
import Describe from "@/components/FilmCellDetail";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/film",
      name: "Films",
      component: Films
    },
    {
      path: "/describe",
      name: "Describe",
      component: Describe
    }
  ]
});
