import jsonp from '../common/js/jsonp.js'
import {commonParams, option} from './config.js'
import axios from 'axios'

export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let params = {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  }
  params = Object.assign({}, params, commonParams)
  return jsonp(url, params, option)
}

export function getDiscList () {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  let params = {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 809148348,
    callback: 'recom'
  }
  let data = '{"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"music.web_album_library","method":"get_album_by_tags","param":{"area":7,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":40,"click_albumid":0}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}'
  data = {data: data}

  let originOption = Object.assign({}, option, {name: 'recom'})
  params = Object.assign({}, params, data, commonParams)
  return jsonp(url, params, originOption)
}

export function getSongList (disstid) {
  const url = '/api/getSongList'
  let params = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  }

  params = Object.assign({}, commonParams, params)

  return axios.get(url, {
    params
  })
    .then((response) => { return Promise.resolve(response.data) })
    .catch((error) => { console.log(error) })
}
