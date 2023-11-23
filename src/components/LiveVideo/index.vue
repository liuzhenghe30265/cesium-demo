<template>
  <div class="live_video_container">
    <div v-if="type === 'flv'">
      <LiveqingPlayer
        :url="url"
        :stretch="stretch"
        :controls="controls"
      />
    </div>
    <div v-else>
      <WebrtcPlayer :url="url" />
    </div>
  </div>
</template>

<script>
import LiveqingPlayer from './components/LiveqingPlayer.vue'
import WebrtcPlayer from './components/WebrtcPlayer.vue'
export default {
  name: 'LiveVideo',

  components: {
    LiveqingPlayer,
    WebrtcPlayer
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

  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
