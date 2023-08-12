<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div style="position: absolute;right: 50px;top: 100px;z-index: 9;">
      <div>
        <button @click="handlePlay('play')">播放动画</button>
        <button @click="handlePlay('reverse')">播放动画（反）</button>
        <button @click="handlePlay('paused')">暂停</button>
        <button @click="handlePlay('stop')">停止动画</button>
      </div>
      <div>
        <button @click="handlePlay2('play')">播放动画</button>
        <button @click="handlePlay2('stop')">停止动画</button>
      </div>
    </div>
    <ThreeModel ref="ThreeModel" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-caller */
/* eslint-disable eqeqeq */
import ThreeModel from './components/ThreeModel.vue'

export default {
  components: {
    ThreeModel
  },
  data() {
    return {
      paused: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
  },
  methods: {
    handlePlay2(val) {
      if (val === 'play') {
        this.$refs.ThreeModel.modelAnimationAction2.play()
      } else if (val === 'stop') {
        this.$refs.ThreeModel.modelAnimationAction2.stop()
      }
    },
    handlePlay(val) {
      if (val === 'play') {
        this.$refs.ThreeModel.modelAnimationAction.paused = true
        this.$refs.ThreeModel.modelAnimationAction.timeScale = 1
        this.$refs.ThreeModel.modelAnimationAction.paused = false
        this.$refs.ThreeModel.modelAnimationAction.play()
      } else if (val === 'reverse') {
        this.$refs.ThreeModel.modelAnimationAction.paused = true
        this.$refs.ThreeModel.modelAnimationAction.timeScale = -1
        this.$refs.ThreeModel.modelAnimationAction.paused = false
        this.$refs.ThreeModel.modelAnimationAction.play()
      } else if (val === 'paused') {
        this.paused = !this.paused
        this.$refs.ThreeModel.modelAnimationAction.paused = this.paused
      } else if (val === 'stop') {
        this.$refs.ThreeModel.modelAnimationAction.stop()
      }
    }
  }
}
</script>

<style lang="scss">
.btns_container {
  position: absolute;
  z-index: 9;
  color: #fff;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  bottom: 100px;
  left: 0;
}
</style>
