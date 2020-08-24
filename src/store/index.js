import Vue from 'vue'
import Vuex from 'vuex'
// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  actions,
  getters,
  mutations,
  state
})

export default store
