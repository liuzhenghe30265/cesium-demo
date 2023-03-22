<template>
  <div class="webrtc_container">
    <video
      ref="video"
      class="webrtc_video"
    />
  </div>
</template>
<script>
export default {
  props: {
    url: {
      default: '',
      type: String
    },
    autoplay: {
      default: true,
      type: Boolean
    },
    httpMode: {
      default: 'https',
      type: String
    }
  },
  data() {
    return {
      $player: null,
      status: true
    }
  },
  watch: {
    url(val) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init() {
      const video = this.$refs.video
      if (this.$player) this.$player.destroy()
      this.$player = new JSWebrtc.Player(this.url, {
        video: video,
        autoplay: this.autoplay,
        httpMode: this.httpMode,
        onPlay: obj => {
          video.addEventListener('canplay', obj => {
            console.log('............canplay', obj)
          })
        },
        onPause: function () {}
      })
    },
    pause() {
      if (this.$player) this.$player.pause()
    },
    play() {
      if (this.$player) this.$player.play()
    },
    restart() {
      if (this.$player) {
        this.$player.pause()
        this.$player.play()
      }
    },
    destroy() {
      if (!this.$player) return
      this.$player.destroy()
    }
  }
}
</script>
  <style lang="scss" scoped>
.webrtc_video {
  background: #333;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>