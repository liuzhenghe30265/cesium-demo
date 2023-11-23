<template>
  <div class="webrtc_player_container">
    <video
      ref="video"
      class="webrtc_video"
      :class="{ fill: fill }"
    />
  </div>
</template>

<script>
export default {
  name: 'WebrtcPlayer',

  components: {},

  props: {
    fill: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      $player: null
    }
  },

  computed: {},

  watch: {},

  mounted() {
    const video = this.$refs.video
    this.$player = new JSWebrtc.Player(this.url, {
      video: video,
      autoplay: true,
      httpMode: 'https',
      onPlay: obj => {
        console.log('onplay', obj)
        video.addEventListener('canplay', obj => {
          console.log('canplay', obj)
        })
      },
      onPause: function () {}
    })
  },

  methods: {}
}
</script>

<style lang='scss' scoped>
.webrtc_player_container {
  .webrtc_video {
    width: 100%;
    height: 100%;
    &.fill {
      object-fit: fill;
    }
  }
}
</style>