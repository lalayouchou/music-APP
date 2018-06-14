/**
 * [addZero description]
 * @param {Number} val [description] 传入的值
 * @param {Number} num [description] 返回的值的位数，如果不足，则用0补充，如果超过，返回原值
 */
export function addZero (val, num=2) {
  const len = (val + '').length
  while (len < num) {
    val = '0' + val
  }
  return val
}