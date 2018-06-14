/**
 * [addZero description]
 * @param {Number} val [description] 传入的值
 * @param {Number} num [description] 返回的值的位数，如果不足，则用0补充，如果超过，返回原值
 */
export function addZero (val, num = 2) {
  let len = (val + '').length
  while (len < num) {
    val = '0' + val
    len++
  }
  return val
}

export function shuffle (list) {
  list = list.concat([])
  // 也可以使用list.slice(),因为这是一个工具类函数，
  // 不能改变传入的值，同时注意这是一个数组，是引用类数据类型，不能通过单纯的赋值复制
  for (let i = 0; i < list.length; i++) {
    const j = getRandom(0, i)
    const t = list[i]
    list[i] = list[j]
    list[j] = t
  }
  return list
}

function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
