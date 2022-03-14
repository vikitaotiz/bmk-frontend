import axios from "axios";

// main backend url
import { app_url } from "src/components/GlobalConfig"

export default {
  namespaced: true,

  state: {
    userData: null
  },

  getters: {
    user: state => state.userData
  },

  mutations: {
    setUserData(state, user) {
      state.userData = user;
    }
  },

  actions: {
    getUserData({ commit }) {
      axios
        .get(app_url + "user", {
          headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`}
        }).then(response => {
          commit("setUserData", response.data);
        }).catch(() => {
          localStorage.removeItem("authToken");
        });
    },
    sendLoginRequest({ commit }, data) {
      commit("setErrors", {}, { root: true });
      return axios
        .post(app_url + "login", data)
        .then(response => {
          commit("setUserData", response.data.user);
          localStorage.setItem("authToken", response.data.token);
        });
    },
    sendRegisterRequest({ commit }, data) {
      commit("setErrors", {}, { root: true });
      return axios
        .post(app_url + "register", data)
        .then(response => {
          commit("setUserData", response.data.user);
          localStorage.setItem("authToken", response.data.token);
        });
    },
    sendLogoutRequest({ commit }) {
      axios.post(app_url + "logout",{
        headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`}
      }).then(() => {
        commit("setUserData", null);
        localStorage.removeItem("authToken");
      });
    },
    sendVerifyResendRequest() {
      return axios.get(app_url + "email/resend");
    },
    sendVerifyRequest({ dispatch }, hash) {
      return axios
        .get(app_url + "email/verify/" + hash)
        .then(() => {
          dispatch("getUserData");
        });
    }
  }
};
