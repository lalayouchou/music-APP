import originJsonp from 'jsonp'

export default function jsonp (url, params, option) {
  url = url + (url.indexOf('?') === -1 ? '?' : '&') + handleParams(params)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}

function handleParams (params) {
  let url = ''
  for (let k in params) {
    let value = params[k] === undefined ? '' : params[k]
    url += `&${encodeURIComponent(k)}=${encodeURIComponent(value)}`
  }
  return url ? url.slice(1) : ''
}
