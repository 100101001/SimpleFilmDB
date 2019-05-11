// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import { Loading } from "element-ui";

var loadingInstance;

var count = 0;

axios.interceptors.request.use(req => {
  if (count > 0) {
    loadingInstance.close();
  }
  count++;
  loadingInstance = Loading.service({
    target: "FilmCell",
    text: "加载中...",
    background: "rgba(0, 0, 0, 0.2)"
  });
  return req;
});

axios.interceptors.response.use(res => {
  loadingInstance.close();
  count = 0;
  return res;
});

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
