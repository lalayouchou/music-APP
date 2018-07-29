import {commonParams} from './config.js'
import axios from 'axios'

export function getHotKey () {
  const url = '/api/getHotKey'
  let params = {
    _: +new Date(),
    g_tk: 5381,
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  }
  /* let originOption = Object.assign({}, option, {name: 'MusicJsonCallback_lrc'}) */
  params = Object.assign({}, commonParams, params)
  return axios.get(url, {
    params
  })
    .then((res) => { return Promise.resolve(res.data) })// axios返回的数据都放在response.data里面
    .catch((e) => { console.log(e) })
}

export function search (keyword, page, catZhida) {
  const url = '/api/search'
  let params = {
    _: +new Date(),
    g_tk: 5381,
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    w: keyword,
    zhidaqu: 1,
    catZhida: catZhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all'
  }
  /* let originOption = Object.assign({}, option, {name: 'MusicJsonCallback_lrc'}) */
  params = Object.assign({}, commonParams, params)
  return axios.get(url, {
    params
  })
    .then((res) => { return Promise.resolve(res.data) })// axios返回的数据都放在response.data里面
    .catch((e) => { console.log(e) })
}
