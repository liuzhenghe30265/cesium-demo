/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

/**
 * @description: 计算距离点位角度为 deg 的点位
 * @param {*} lng
 * @param {*} lat
 * @param {*} deg
 * @param {*} distance
 * @return {*}
 */
function distancePos (lng, lat, deg, distance) {
  return {
    longitude: lng + distance * Math.sin(deg * Math.PI / 180) * 180 / (Math.PI * 6371229 * Math.cos(lat * Math.PI / 180)),
    latitude: lat + distance * Math.cos(deg * Math.PI / 180) / (Math.PI * 6371229 / 180)
  }
}

export default {
  distancePos
}