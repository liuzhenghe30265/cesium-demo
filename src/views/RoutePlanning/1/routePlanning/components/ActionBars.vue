<template>
  <div
    class="action_bars_container">
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutDown">
      <div
        class="btns_con"
        v-if="btnsVisible">
        <v-touch
          @swipedown="swipedown()">
          <div
            class="abc_pub abc_left">
            <div
              v-for="(item, index) of leftBtns"
              :key="index"
              class="al_pub"
              :class="'al_' + item.value"
              @mousedown.stop="handleMousedown('XY', item.value)"
              @touchstart.stop="handleMousedown('XY', item.value)"
              @click.stop="handleClick('XY', item.value)"
              @mouseleave="handleMouseUp"
              @mouseup.stop="handleMouseUp"
              @touchend.stop="handleMouseUp"
              @blur="handleMouseUp">
              <img
                :src="item.image"
                alt="">
            </div>
          </div>
        </v-touch>
        <v-touch
          @swipedown="swipedown()">
          <div
            class="abc_pub abc_right">
            <div
              v-for="(item, index) of rightBtns"
              :key="index"
              class="al_pub"
              :class="'al_' + item.value"
              @mousedown.stop="handleMousedown('Z', item.value)"
              @touchstart.stop="handleMousedown('Z', item.value)"
              @click.stop="handleClick('Z', item.value)"
              @mouseleave="handleMouseUp"
              @mouseup.stop="handleMouseUp"
              @touchend.stop="handleMouseUp"
              @blur="handleMouseUp">
              <img
                :src="item.image"
                alt="">
            </div>
          </div>
        </v-touch>
      </div>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutDown">
      <div
        v-if="!btnsVisible"
        class="action_bars_control">
        <img
          :src="require('@/assets/images/controls/routePlanning/action/back.png')"
          alt=""
          @click="handleBack">
      </div>
    </transition>
  </div>
</template>
<script>
// import {
//   debounce
// } from 'lodash'
export default {
  name: 'ActionBars',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: null,
      btnsVisible: true,
      rightBtns: [
        {
          value: 'up',
          image: require('@/assets/images/controls/routePlanning/action/up0.png')
        },
        {
          value: 'down',
          image: require('@/assets/images/controls/routePlanning/action/down0.png')
        }
      ],
      leftBtns: [
        {
          value: 'up',
          image: require('@/assets/images/controls/routePlanning/action/up.png')
        },
        {
          value: 'down',
          image: require('@/assets/images/controls/routePlanning/action/down.png')
        },
        {
          value: 'left',
          image: require('@/assets/images/controls/routePlanning/action/left.png')
        },
        {
          value: 'right',
          image: require('@/assets/images/controls/routePlanning/action/right.png')
        }
      ]
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    // const DOM = window.document.body
    // DOM.onmouseup = () => {
    //   this.handleMouseUp()
    // }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    handleBack () {
      this.btnsVisible = true
    },
    // changeValue: debounce(function (type, value) {
    //   if (type === 'changeZ') {
    //     this.$emit('changeZ', value)
    //   } else {
    //     this.$emit('changeXY', value)
    //   }
    // }, 400),
    changeValue (type, value) {
      if (type === 'changeZ') {
        this.$emit('changeZ', value)
      } else {
        this.$emit('changeXY', value)
      }
    },
    handleMouseUp () {
      clearInterval(this.timer)
      this.$store.commit('routePlanning/updateAtionBarsPress', false)
    },
    swipedown () {
      this.btnsVisible = false
    },
    handleClick (type, value) {
      if (type === 'Z') {
        this.changeValue('changeZ', value)
      } else {
        this.changeValue('changeXY', value)
      }
    },
    handleMousedown (type, value) {
      this.$store.commit('routePlanning/updateAtionBarsPress', true)
      if (this.timer) {
        clearInterval(this.timer)
      }
      let time = 10
      if (type === 'Z') {
        time = 100
      }
      this.timer = setInterval(() => {
        if (type === 'Z') {
          this.changeValue('changeZ', value)
        } else {
          this.changeValue('changeXY', value)
        }
      }, time)
    }
  }
}
</script>

<style lang="scss" scoped>
.action_bars_container {
  position: absolute;
  z-index: 997;
  bottom: 1.5rem;
  box-sizing: border-box;
  width: 100%;
  pointer-events: none;
  .btns_con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .abc_pub {
      position: relative;
      pointer-events: initial;
      .al_pub {
        position: absolute;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        user-select: none;
        img {
          width: 100%;
          height: 100%;
          &:active {
            transform: translateX(1px) translateY(1px);
          }
        }
        &.al_up {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        &.al_down {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        &.al_left {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        &.al_right {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      }
    }
    .abc_left {
      left: 3rem;
      width: 2.8rem;
      height: 2.8rem;
    }
    .abc_right {
      right: 2rem;
      width: 2.8rem;
      height: 2.8rem;
    }
  }
  .action_bars_control {
    position: absolute;
    z-index: 998;
    bottom: 0;
    left: 2rem;
    width: 0.58rem;
    height: 0.58rem;
    cursor: pointer;
    pointer-events: initial;
    img {
      width: 100%;
      height: 100%;
      &:active {
        transform: translateX(1px) translateY(1px);
      }
    }
  }
}
</style>
