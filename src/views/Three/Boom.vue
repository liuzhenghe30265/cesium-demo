<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div style="position: absolute;width: 400px;right: 50px;top: 100px;z-index: 9;">
      <div>
        <el-slider
          v-model="sliderVal"
          :min="0"
          :max="100"
          @input="handleChange"
        />
      </div>
    </div>
    <div class="model_container">
      <ThreeModel
        :id="'three_model_a'"
        ref="ThreeModelA"
        :url="'model/SnowyVillage.glb'"
        :size="5"
        class="three_model"
      />
    </div>
  </div>
</template>

<script>
import ThreeModel from './components/ThreeModelBoom.vue'

export default {
  components: {
    ThreeModel
  },
  data() {
    return {
      sliderVal: 0,
      paused: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
  },
  methods: {
    handleChange(val) {
      this.$refs.ThreeModelA.applyScalar(val)
    }
  }
}
</script>

<style lang="scss">
.model_container {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  .three_model {
    width: 800px;
    height: 800px;
  }
}
</style>
