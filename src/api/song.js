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
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
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
