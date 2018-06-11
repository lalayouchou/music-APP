import * as types from './mutaion-types.js'
import {playMode} from 'common/js/config.js'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_MODE, playMode.sequence)
  commit(types.SET_CURRENT_INDEX, index)
}
