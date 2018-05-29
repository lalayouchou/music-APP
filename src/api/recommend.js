import jsonp from '../common/js/jsonp.js'
import {commonParams, option} from './config.js'

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
