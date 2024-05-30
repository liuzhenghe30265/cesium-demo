<template>
  <transition
    :enter-active-class="floatting ? '' : 'animate__animated animate__bounceInDown'"
    :leave-active-class="floatting ? '' : 'animate__animated animate__bounceOutUp'"
    @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="floating_dom"
      :class="[
        type && !iconClass ? `floating_dom--${ type }` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass,
        floatting ? 'floatting' : ''
      ]"
      :style="positionStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <div
        class="floating_dom_inner">
        <div
          class="tip_dom">
          <img
            class="icon"
            :src="require('@/assets/images/site.png')"
            alt=""
            style="width: 20px;height: 20px;">
          <div>
            <div>
              经度：{{ messageData.longitude }}
            </div>
            <div>
              纬度：{{ messageData.latitude }}
            </div>
            <div>
              海拔：{{ messageData.altitude }}
            </div>
          </div>
        </div>
        <i v-if="showClose"
          class="floating_dom__closeBtn el-icon-close"
          @click="close" />
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
/* eslint-disable no-undef */
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  data () {
    return {
      newPosition: null, // 更新位置
      floatting: false,
      source: '', // 来源
      moreTxt: '', // 更多操作
      showImageBtn: '', // 标题
      title: '', // 标题
      alarmSound: false, // 报警音效
      targetSelect: true,
      active: false,
      imageVisible: false,
      updateVal: {},
      sign: '',
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    }
  },

  computed: {
    typeClass () {
      return this.type && !this.iconClass
        ? `floating_dom__icon el-icon-${typeMap[this.type]}`
        : ''
    },
    positionStyle () {
      return {
        top: `${this.verticalOffset}px`
      }
    }
  },

  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
        this.handleAfterLeave()
      }
    }
  },
  mounted () {
    viewer.scene.preRender.addEventListener(this.eventListener)
    this.startTimer()
    // document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy () {
    viewer.scene.preRender.removeEventListener(this.eventListener)
    // document.removeEventListener('keydown', this.keydown)
  },

  methods: {
    eventListener () {
      const position = Cesium.Cartesian3.fromDegrees(
        this.messageData.longitude,
        this.messageData.latitude,
        this.messageData.altitude
      )
      const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        position
      )
      // const cameraHeight = viewer.camera.positionCartographic.height
      // const value = 1 - cameraHeight / 5000
      // const scale = value < 0.2 ? 0.2 : value > 1 ? 1 : value
      // if (scale === 0.2) {
      //   this.$parent.$el.style.display = 'none'
      //   return
      // }
      if (position) {
        this.$el.style.transform = `translateX(-50%) translateY(-50%)`
        this.$el.style.left = `${result.x}px`
        this.$el.style.top = `${result.y}px`
      }
    },
    updatePosition (val) {
      this.newPosition = val
    },
    updateTargetSelect (val) {
      this.targetSelect = val
    },
    updateActive (val) {
      this.active = val
    },
    updateImageVisible (visible) {
      this.imageVisible = visible
    },
    update (data) {
      this.updateVal = data
      this.sign = new Date().toLocaleString()
    },
    updateType (type) {
      this.type = type
    },
    handleAfterLeave () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    close () {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },

    clearTimer () {
      clearTimeout(this.timer)
    },

    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown (e) {
      if (e.keyCode === 27) {
        // esc 关闭消息
        if (!this.closed) {
          this.close()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.floating_dom {
  width: 100%;
  position: absolute;
  top: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  .floating_dom_inner {
    position: relative;
    pointer-events: auto;
  }
  &.floatting {
    width: auto;
  }
  .floating_dom__closeBtn {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 24px;
    padding: 4px;
  }
}
.tip_dom {
  display: flex;
  align-items: center;
  .icon {
    animation: scale 2s linear infinite;
  }
}
@keyframes scale {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
