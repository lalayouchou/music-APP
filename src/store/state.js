import {playMode} from 'common/js/config.js'

const state = {
  singer: {},
  playList: [],// 歌曲播放列表
  sequenceList: [],// 歌单展示列表，如果是顺序播放，两个列表是一样的，如果是随机播放，两个列表是不一样的
  palying: false,
  fullScreen: false,
  currentIndex: -1,
  mode: playMode.sequence // 播放模式
}

export default state
