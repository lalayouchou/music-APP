import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getters.js' // 这里导出的是多个零碎的值，这个语法可以把导出的所有东西塞入getters对象中
import mutations from './mutations.js'
import state from './state.js' // 这里是直接返回了一个默认对象
import createLogger from 'vuex/dist/logger' // 自带的官方插件，用来生成日志,也只在开发环境中使用

Vue.use(Vuex) // 注册插件

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug, // 严格模式，只在开发环境中使用
  plugins: debug ? [createLogger()] : []
})
