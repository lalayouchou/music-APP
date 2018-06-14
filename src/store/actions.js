import * as types from './mutaion-types.js'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

export const selectPlay = function ({commit, state}, {list, index}) {
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findCurrentIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  // commit(types.SET_MODE, playMode.sequence) 不需要，点击歌曲播放的时候根本不会修改播放模式，播放模式在播放器内核中修改
  commit(types.SET_CURRENT_INDEX, index)
}

export const selectRandomPlay = function ({commit, state}, {list}) {
  const randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
}

function findCurrentIndex (list, song) {
  return list.findIndex((item) => item.id === song.id)
}
