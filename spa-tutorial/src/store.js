import Vue from 'vue'
import Vuex from 'vuex'
import product from '@/store/product.js'
Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    start(state) {
      state.loading = true
    },
    end(state) {
      state.loading = false
    }
  }
}
