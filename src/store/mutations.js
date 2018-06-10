import * as types from './mutaion-types.js'

const mutations = {
  [types.GET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.GET_FULL_SCREEN] (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  [types.GET_PALYING] (state, playing) {
    state.playing = playing
  },
  [types.GET_MODE] (state, mode) {
    state.mode = mode
  },
  [types.GET_CURRENT_INDEX] (state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [types.GET_PALY_LIST] (state, playList) {
    state.palyList = palyList
  },
  [types.GET_SEQUENCE_LIST] (state, sequenceList) {
    state.sequenceList = sequenceList
  }
}

export default mutations
