import {commonParams} from './config.js'
import axios from 'axios'

export function getSongLyric (songmid) {
  const url = '/api/getSongLyric'
  let params = {
    pcachetime: +new Date(),
    /* callback: 'MusicJsonCallback_lrc', 不使用jsonp获取数据 */
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    songmid,
    platform: 'ypp',
    format: 'json' // 这里由于使用后端代理，我们希望返回的是一个json数据，而不是jsonp
  }
  /* let originOption = Object.assign({}, option, {name: 'MusicJsonCallback_lrc'}) */
  params = Object.assign({}, params, commonParams)
  return axios.get(url, {
    params
  })
    .then((res) => { return Promise.resolve(res.data) })// axios返回的数据都放在response.data里面
    .catch((e) => { console.log(e) })
}
