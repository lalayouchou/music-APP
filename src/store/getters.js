export const singer = state => state.singer // 类似于计算属性,接收的第一个参数是state

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
