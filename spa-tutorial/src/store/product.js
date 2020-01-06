import products from '@/api/products.js'

export default {
  namespaced: true,
  state: {
    detail: {}
  },
  getters: {
    detail: state => state.detail
  },
  mutations: {
    set(state, { detail }) {
      state.detail = detail
    },
    clear(state) {
      state.detail = {}
    }
  },
  actions: {
    load({ commi }, id) {
      products.asyncFind(id, detail => {
        commi('set', { detail })
      })
    },
    destroy({ commit }) {
      commit('clear')
    }
  }
}
