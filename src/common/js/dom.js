export function getData (el, key, value) {
  key = 'data-' + key
  if (value) {
    return el.setAttribute(key, value)
  } else {
    return el.getAttribute(key)
  }
}
