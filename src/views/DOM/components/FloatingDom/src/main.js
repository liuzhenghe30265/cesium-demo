/* eslint-disable no-undef */
import Vue from 'vue'
import Main from './main.vue'
function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
function isVNode (node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}
const isObject = function (obj) {
  return obj !== null && typeof obj === 'object'
}

const MessageConstructor = Vue.extend(Main)

let instance
const instances = []
let seed = 1

const FloatingDom = function (options) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  const userOnClose = options.onClose
  const id = 'message_' + seed++

  options.onClose = function () {
    FloatingDom.close(id, userOnClose)
  }
  instance = new MessageConstructor({
    data: options
  })
  instance.id = id
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }
  instance.$mount()
  if (instance.floatting && viewer && viewer.cesiumWidget && viewer.cesiumWidget.container) {
    // ^ 随地球视角变化的标注添加到地球容器中中
    viewer.cesiumWidget.container.appendChild(instance.$el)
  } else {
    // ^ 顶部弹窗类
    document.body.appendChild(instance.$el)
    // document.getElementById('message_tip_box').appendChild(instance.$el)
  }
  let verticalOffset = (options.offset || 20) + 110 // ^ 适配虎视标题
  if (options.accVerticalOffset) {
    // 累计垂直偏移量
    instances.forEach(item => {
      if (!item.floatting) {
        // ^ 浮动类的标注（模型单体，杆塔图片等），不做计算
        verticalOffset += item.$el.offsetHeight + 16
      }
    })
  }
  instance.verticalOffset = verticalOffset
  instance.visible = true
  instance.$el.style.zIndex = options.zIndex || 9

  instances.push(instance)
  return instance
};

['success', 'warning', 'info', 'error'].forEach(type => {
  FloatingDom[type] = (options) => {
    if (isObject(options) && !isVNode(options)) {
      return FloatingDom({
        ...options,
        type
      })
    }
    return FloatingDom({
      type,
      message: options
    })
  }
})

FloatingDom.close = function (id, userOnClose) {
  const len = instances.length
  let index = -1
  let removedHeight
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id && !instances[i].floatting) {
      // ^ 非浮动类（地图上的标注）
      removedHeight = instances[i].$el.offsetHeight
      index = i
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  for (let i = index; i < len - 1; i++) {
    const dom = instances[i].$el
    dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px'
  }
}

FloatingDom.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default FloatingDom
