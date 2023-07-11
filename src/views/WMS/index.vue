<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div class="layer_container">
      <button id="btn">清除</button>
      <el-tree
        ref="tree"
        :data="layers"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="defaultCheckedKeys"
        highlight-current
        @check="handleCheckChange"
      />
    </div>
  </div>
</template>

  <script>
/* eslint-disable no-undef */
// import {
//   getExtend
// } from '@/utils/CesiumUtils.js'
import { findIndex } from 'lodash'
export default {
  data() {
    return {
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      basePath: '',
      layers: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    const _layers = this.layers.map(_ => _.id)
    this.defaultCheckedKeys = _layers

    const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
      url: this.basePath,
      layers: _layers.join(','),
      // maximumLevel: 21,
      parameters: {
        transparent: true,
        format: 'image/png',
        srs: 'EPSG:4326',
        tiled: true
      },
      tileWidth: 1024,
      tileHeight: 1024
    })
    const imageryLayer = new Cesium.ImageryLayer(wmsImageryProvider)
    imageryLayer.name = '666'
    imageryLayer.id = '666'
    viewer.imageryLayers.add(imageryLayer)

    document.getElementById('btn').onclick = function () {
      const layer = viewer.imageryLayers.get(
        findIndex(viewer.imageryLayers._layers, function (_) {
          return _.id === '666'
        })
      )
      viewer.imageryLayers.remove(layer)
    }

    // Australia
    viewer.imageryLayers.add(
      new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
          layers: 'Hydrography:bores',
          parameters: {
            transparent: true,
            format: 'image/png',
            srs: 'EPSG:4326'
          },
          tileWidth: 1024,
          tileHeight: 1024
        })
      )
    )

    // U. S.
    viewer.imageryLayers.add(
      new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
          layers: 'nexrad-n0r',
          credit: 'Radar data courtesy Iowa Environmental Mesonet',
          parameters: {
            transparent: 'true',
            format: 'image/png'
          }
        })
      )
    )
    // viewer.imageryLayers.add(
    //   new Cesium.ImageryLayer(
    //     new Cesium.WebMapServiceImageryProvider({
    //       url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
    //       layers: 'goes_conus_ir',
    //       credit: 'Radar data courtesy Iowa Environmental Mesonet',
    //       parameters: {
    //         transparent: 'true',
    //         format: 'image/png'
    //       }
    //     })
    //   )
    // )
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      const ids = this.$refs.tree.getCheckedKeys()
      const _layers = ids.join(',')
      const imageryLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
          url: this.basePath,
          layers: _layers,
          parameters: {
            transparent: true,
            format: 'image/png',
            srs: 'EPSG:4326',
            tiled: true
          },
          tileWidth: 1024,
          tileHeight: 1024
        })
      )
      imageryLayer.id = '666'
      imageryLayer.name = '666'
      viewer.imageryLayers.add(imageryLayer)

      const allLayers = viewer.imageryLayers._layers.filter(
        _ => _.name === '666'
      )
      const removeLayers = allLayers.filter(
        _ => _.imageryProvider.layers !== _layers
      )
      setTimeout(() => {
        for (let index = 0; index < removeLayers.length; index++) {
          const layer = removeLayers[index]
          viewer.imageryLayers.remove(layer)
        }
      }, 1000)
    }
  }
}
</script>

<style>
.layer_container {
  position: absolute;
  right: 50px;
  top: 50px;
  z-index: 999;
}
</style>
