import {getSongLyric} from '@/api/song'
import {ERR_OK} from '@/api/config'
import { Base64 } from 'js-base64'
class Song {
  // 使用工厂函数创建对象，这里使用了对象解构写法
  constructor ({id, name, mid, image, duration, singer, album, url}) {
    this.id = id
    this.name = name
    this.mid = mid
    this.image = image
    this.duration = duration
    this.singer = singer
    this.album = album
    this.url = url
  } // 类写法中，不需要添加','

  getLyric () {
    if (this.lyric) { // 如果已经获取过歌词数据，那么直接把歌词数据返回
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => { // 始终返回的是一个Promise对象
      getSongLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
// 暴露出去的函数接口，只要把musicData传入就可以了
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    name: musicData.songname,
    mid: musicData.songmid,
    duration: musicData.interval,
    album: musicData.albumname,
    singer: filterSinger(musicData.singer),
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}
// 连接多个歌手名称，join在只有一个的时候，也可以使用
function filterSinger (singer) {
  if (!singer) {
    return
  }
  let ret = []
  for (let item of singer) {
    ret.push(item.name)
  }
  return ret.join('/')
}
