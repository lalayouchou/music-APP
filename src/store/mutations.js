import * as types from './mutaion-types.js'

const mutations = {
  [types.GET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
