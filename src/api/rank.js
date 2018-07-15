import {commonParams} from './config.js'
import axios from 'axios'

export function getTopList () {
  const url = '/api/getTopList'

  const params = Object.assign({}, commonParams, {
    platform: 'h5',
    uid: 0,
    needNewCode: 1,
    _: +new Date()
  })
  return axios(url, {
    params
  })
    .then((res) => Promise.resolve(res.data))
    .catch((e) => { console.log(e) })
}

export function getMusicList (topid) {
  const url = '/api/getMusicList'

  const params = Object.assign({}, commonParams, {
    topid,
    platform: 'h5',
    uid: 0,
    needNewCode: 1,
    _: +new Date(),
    tpl: 3,
    page: 'detail',
    type: 'top'
  })
  return axios(url, {
    params
  })
    .then((res) => Promise.resolve(res.data))
    .catch((e) => { console.log(e) })
}
