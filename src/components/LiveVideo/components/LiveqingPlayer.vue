<template>
  <div class="live_player_container">
    <LivePlayer
      :video-url="url"
      :live="false"
      :muted="false"
      aspect="fullscreen"
      :stretch="stretch"
      :show-custom-button="true"
      :hide-snapshot-button="false"
      :hide-fullscreen-button="false"
      :controls="controls"
      :hide-big-play-button="true"
      @error="handleError"
    />
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  name: 'LiveqingPlayer',

  components: {
    LivePlayer
  },

  props: {
    controls: {
      type: Boolean,
      default: false
    },
    stretch: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {
    handleError() {
      this.$message.error({
        customClass: 'message_new_style',
        message: '该视频无法播放！'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.live_player_container {
  width: 100%;
  height: 100%;
}
</style>