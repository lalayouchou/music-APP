export function getData (el, key, value) {
  key = 'data-' + key
  if (value) {
    return el.setAttribute(key, value)
  } else {
    return el.getAttribute(key)
  }
}

let ElementStyle = document.createElement('div').style

let vendor = (function () {
  const prefixs = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in prefixs) {
    if (ElementStyle[prefixs[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function addPrefix (style) {
  if (!vendor) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return `${vendor}${handleStyle(style)}`
}

function handleStyle (style) {
  return style[0].toUpperCase() + style.slice(1)
}
