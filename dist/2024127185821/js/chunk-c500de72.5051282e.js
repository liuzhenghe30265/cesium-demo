(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c500de72"],{"1f40":function(e,t,i){e.exports=i.p+"2024127185821/img/gradation.6a9e6aaa.png"},"3bdc":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}})},r=[],o=(i("a483"),{data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap();var e=new Cesium.Cesium3DTileset({url:"http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",debugShowMemoryUsage:!1});function t(e,t,i,a,r,o){var n=viewer.entities.add({wall:{positions:Cesium.Cartesian3.fromDegreesArray(e),maximumHeights:t,minimumHeights:i,material:new Cesium.DynamicWallMaterialProperty({color:Cesium.Color.fromCssColorString(a),trailImage:r,duration:o})}});return n}viewer.scene.primitives.add(e),viewer.zoomTo(e),t([108.95816733886228,34.22253637959828,108.95820680817125,34.21706473291823,108.96123913566905,34.21706546799099,108.96179243633605,34.21702583001026],[470,470,470,470],[420,420,420,420],"#ffff00",i("1f40"),1e3),t([108.9590995,34.2201324,108.9598067,34.2201193,108.9598333,34.2195012,108.9590877,34.2195194,108.9590995,34.2201324],[470,470,470,470,470],[420,420,420,420,420],"#20E8E980",i("1f40"),1e3)},methods:{}}),n=o,l=i("2877"),m=Object(l["a"])(n,a,r,!1,null,null,null);t["default"]=m.exports},a483:function(e,t){function i(e){this._definitionChanged=new Cesium.Event,this._color=void 0,this._colorSubscription=void 0,this.color=e.color,this.duration=e.duration,this.trailImage=e.trailImage,this._time=(new Date).getTime()}Object.defineProperties(i.prototype,{isConstant:{get:function(){return!1}},definitionChanged:{get:function(){return this._definitionChanged}},color:Cesium.createPropertyDescriptor("color")}),i.prototype.getType=function(e){return"DynamicWall"},i.prototype.getValue=function(e,t){return Cesium.defined(t)||(t={}),t.color=Cesium.Property.getValueOrClonedDefault(this._color,e,Cesium.Color.WHITE,t.color),this.trailImage?t.image=this.trailImage:t.image=Cesium.Material.DynamicWallImage,this.duration&&(t.time=((new Date).getTime()-this._time)%this.duration/this.duration),viewer.scene.requestRender(),t},i.prototype.equals=function(e){return this===e||e instanceof i&&Cesium.Property.equals(this._color,e._color)},Cesium.DynamicWallMaterialProperty=i,Cesium.Material.DynamicWallType="DynamicWall",Cesium.Material.DynamicWallImage="/images/colors.png",Cesium.Material.DynamicWallSource="czm_material czm_getMaterial(czm_materialInput materialInput)\n                                          {\n                                          czm_material material = czm_getDefaultMaterial(materialInput);\n                                          vec2 st = materialInput.st;\n                                          vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));\n                                          vec4 fragColor;\n                                          fragColor.rgb = color.rgb / 1.0;\n                                          fragColor = czm_gammaCorrect(fragColor);\n                                          material.alpha = colorImage.a * color.a;\n                                          material.diffuse = color.rgb;\n                                          material.emission = fragColor.rgb;\n                                          return material;\n                                          }",Cesium.Material._materialCache.addMaterial(Cesium.Material.DynamicWallType,{fabric:{type:Cesium.Material.DynamicWallType,uniforms:{color:new Cesium.Color(1,1,1,1),image:Cesium.Material.DynamicWallImage,time:0},source:Cesium.Material.DynamicWallSource},translucent:function(e){return!0}})}}]);