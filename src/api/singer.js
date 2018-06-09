import jsonp from '../common/js/jsonp.js'
import {commonParams, option} from './config.js'

export function getSingerList () {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  let params = {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 809148348,
    callback: 'getUCGI',
    format: 'jsonp'
  }
  let data = '{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
  data = {data: data}

  let originOption = Object.assign({}, option, {name: 'getUCGI'})
  params = Object.assign({}, params, data, commonParams)
  return jsonp(url, params, originOption)
}

export function getDetail (singer) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let params = {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 809148348,
    format: 'jsonp',
    loginUin: 0,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singer.mid
  }

  let originOption = Object.assign({}, option, {name: 'MusicJsonCallbacksinger_track'})
  params = Object.assign({}, params, commonParams)
  return jsonp(url, params, originOption)
}
