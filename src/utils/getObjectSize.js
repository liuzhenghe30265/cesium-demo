import sizeof from 'object-sizeof'

/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

function formetSize (size) {
  let result = ''
  if (size < 1024) {
    result = size + 'B'
  } else if (size < 1048576) {
    result = size / 1024 + 'K'
  } else if (size < 1073741824) {
    result = size / 1048576 + 'M'
  } else {
    result = size / 1073741824 + 'G'
  }
  return result
}

/**
 * @description: 计算对象占用内存的大小
 * @param {*} obj
 */
export function getObjectSize (obj) {
  const value = formetSize(sizeof(obj))
  return value
}
