<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div style="position: absolute; right: 50px; top: 50px;z-index: 999;">
      <div>
        <el-input
          v-model="input"
          placeholder="请输入内容"
        />
        <el-button @click="handleInput">Search</el-button>
      </div>
      <ul>
        <li
          v-for="(item, index) of list"
          :key="index"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { debounce } from 'lodash'
import axios from 'axios'
export default {
  data() {
    return {
      list: [],
      input: '北京'
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
  },
  methods: {
    handleClick(data) {
      const position = data.location.split(',')
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          position[0],
          position[1],
          2000.0
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-80.0),
          roll: 0.0
        }
      })
    },
    handleInput: debounce(function () {
      const _this = this
      axios({
        method: 'get',
        url: 'https://restapi.amap.com/v5/place/text?parameters',
        params: {
          key: '',
          keywords: this.input
        }
      }).then(function (res) {
        if (res.status === 200) {
          _this.list = res.data.pois
        }
      })
    }, 0)
  }
}
</script>

<style></style>
