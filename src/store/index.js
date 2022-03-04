import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import auth from "./auth";

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      errors: []
    },
  
    getters: {
      errors: state => state.errors
    },
  
    mutations: {
      setErrors(state, errors) {
        state.errors = errors;
      }
    },
  
    actions: {},
    
    modules: {
      // example
      auth
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
