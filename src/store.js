// store.js
import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    isAuthenticated: false,
  },
  mutations: {
    setAuth(state, status) {
      state.isAuthenticated = status;
    },
  },
  actions: {
    async checkAuthentication({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/session-info', { withCredentials: true });
        commit('setAuth', !!response.data.userId);
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        commit('setAuth', false);
      }
    },
    async logout({ commit }) {
      try {
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
        commit('setAuth', false);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
});

export default store;
