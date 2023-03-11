import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";
import VueRouter from "vue-router";
import axios from "axios";
import AxiosPlugin from "vue-axios-cors";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VueScrollTo from "vue-scrollto";
import VTooltip from "v-tooltip";

Vue.component("v-select", vSelect);

import "./index.css";
import App from "./App.vue";
import Welcome from "@/views/WelcomePage";
import Login from "@/views/LoginPage";
import SignUp from "@/views/SignUpPage";
import Skeleton from "@/views/PageSkeleton";
import Dashboard from "@/views/TransferDashboard";
import Outgoing from "@/views/OutgoingTransfer";
import Incoming from "@/views/IncomingTransfer";
import IncomingDetail from "@/views/IncomingTransferDetail";
import OutgoingDetail from "@/views/OutgoingTransferDetail";
import AdminPanel from "@/views/AdminPanel";

Vue.config.productionTip = false;
Vue.prototype.$config = {
  apihost: process.env.VUE_APP_APIHOST,
  university: process.env.VUE_APP_UNIVERSITY,
  explorer: process.env.VUE_APP_EXPLORER,
};

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.use(AxiosPlugin);
Vue.use(VueScrollTo);
Vue.use(VTooltip);

const modAuth = {
  namespaced: true,
  state: () => ({
    userToken: null,
    userName: null,
    userDepartment: null,
    userRoles: null,
  }),
  mutations: {
    setUser(state, infoObj) {
      state.userName = infoObj.name;
      state.userDepartment = infoObj.department;
      state.userRoles = infoObj.roles;
      if (Object.prototype.hasOwnProperty.call(infoObj, "token")) {
        state.userToken = infoObj.token;
        Vue.$cookies.set(
          "token",
          state.userToken,
          null,
          null,
          null,
          true,
          "Strict"
        );
      }
    },
    restoreUserToken(state) {
      let token = Vue.$cookies.get("token");
      if (token) {
        state.userToken = token;
      }
    },
    resetState(state) {
      state.userToken = null;
      state.userName = null;
      state.userDepartment = null;
      state.userRoles = null;
    },
  },
  actions: {
    logoutUser(context) {
      context.commit("resetState");
      Vue.$cookies.remove("token");
    },
  },
  getters: {
    isUserAuthenticated: (state) => {
      return state.userToken !== null;
    },
  },
};

const store = new Vuex.Store({
  modules: {
    auth: modAuth,
  },
});

const routes = [
  {
    path: "/",
    component: Welcome,
    meta: {
      title: "Welcome",
      authenticationRequired: false,
    },
  },
  {
    path: "/signup",
    component: SignUp,
    meta: {
      title: "Sign Up",
      authenticationRequired: false,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "Login",
      authenticationRequired: false,
    },
  },
  {
    path: "/",
    component: Skeleton,
    children: [
      {
        path: "/home",
        component: Dashboard,
        meta: {
          title: "Home",
          authenticationRequired: true,
        },
      },
      {
        path: "/outgoing",
        component: Outgoing,
        meta: {
          title: "Outbox",
          authenticationRequired: true,
        },
      },
      {
        path: "/outgoing/:id(\\d+)",
        component: OutgoingDetail,
        meta: {
          title: "Outbox Detail",
          authenticationRequired: true,
        },
      },
      {
        path: "/incoming",
        component: Incoming,
        meta: {
          title: "Inbox",
          authenticationRequired: true,
        },
      },
      {
        path: "/incoming/:id(\\d+)",
        component: IncomingDetail,
        meta: {
          title: "Inbox Detail",
          authenticationRequired: true,
        },
      },
      {
        path: "/admin",
        component: AdminPanel,
        meta: {
          title: "Admin Panel",
          authenticationRequired: true,
        },
      },
    ],
  },
  {
    path: "/explorer",
    beforeEnter() {
      location.href = Vue.prototype.$config.explorer;
    },
    component: { template: "<div>explorer</div>" },
    meta: {
      title: "Explorer",
      authenticationRequired: false,
    },
  },
];
const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (
    Object.prototype.hasOwnProperty.call(to, "meta") &&
    (!Object.prototype.hasOwnProperty.call(to.meta, "authenticationRequired") ||
      to.meta.authenticationRequired)
  ) {
    // check authentication status
    let authenticated = store.getters["auth/isUserAuthenticated"];
    if (!authenticated) {
      store.commit("auth/restoreUserToken");
      let token = store.state.auth.userToken;
      if (token) {
        let apiCallString =
          Vue.prototype.$config.apihost + "/api/whoami?token=" + token;
        authenticated = await axios
          .get(apiCallString)
          .then(({ data }) => {
            if (!Object.prototype.hasOwnProperty.call(data, "error")) {
              store.commit("auth/setUser", data.message);
              return true;
            } else {
              return false;
            }
          })
          .catch(() => false);
      }
    }
    if (!authenticated) {
      next({ path: "/login" });
      return;
    }
  }

  // set page title
  if (
    Object.prototype.hasOwnProperty.call(to, "meta") &&
    Object.prototype.hasOwnProperty.call(to.meta, "title")
  ) {
    document.title = to.meta.title;
  } else {
    document.title = "xchainge";
  }

  next();
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
