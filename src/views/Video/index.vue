<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div class="ul">
      <div
        v-for="(item, index) of urls"
        :key="index
          "
        class="li"
      >
        <WebRtc :url="item" />
      </div>
    </div>
  </div>
</template>

<script>
import WebRtc from './components/WebRtc.vue'
export default {
  components: {
    WebRtc
  },
  data() {
    return {
      urls: [
        // 'webrtc://...',
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.ul {
  position: absolute;
  left: 50px;
  top: 50px;
  width: 800px;
  height: 600px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: space-between;
  z-index: 999;
  pointer-events: none;
  .li {
    width: 50%;
    height: 50%;
  }
}
</style>