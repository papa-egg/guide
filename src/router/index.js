import Vue from "vue";
import Router from "vue-router";

const Home = (r) =>
  require.ensure([], () => r(require("@/pages/home/Home.vue")), "Home");

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/*",
      component: Home,
    },
  ],
});
