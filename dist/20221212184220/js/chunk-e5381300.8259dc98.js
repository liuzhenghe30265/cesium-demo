(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e5381300"],{4575:function(e,i,t){"use strict";t.r(i);var a=function(){var e=this,i=e.$createElement,t=e._self._c||i;return t("div",{staticStyle:{width:"100%",height:"100%"}},[t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}}),t("el-image",{ref:"preview",staticStyle:{display:"none"},attrs:{src:e.url,"preview-src-list":e.srcList}})],1)},n=[],r=t("bee2"),o=t("d4ec"),s=Object(r["a"])((function e(i){Object(o["a"])(this,e),i=Cesium.defaultValue(i,Cesium.defaultValue.EMPTY_OBJECT),this._definitionChanged=new Cesium.Event,this._color=void 0,this._colorSubscription=void 0,this.color=i.color,this.duration=i.duration,this.trailImage=i.trailImage,this._time=performance.now()}));Object.defineProperties(s.prototype,{isConstant:{get:function(){return!1}},definitionChanged:{get:function(){return this._definitionChanged}},color:Cesium.createPropertyDescriptor("color")}),s.prototype.getType=function(){return"PolylineTrail"},s.prototype.getValue=function(e,i){return Cesium.defined(i)||(i={}),i.color=Cesium.Property.getValueOrClonedDefault(this._color,e,Cesium.Color.WHITE,i.color),i.image=this.trailImage,i.time=(performance.now()-this._time)%this.duration/this.duration,i},s.prototype.equals=function(e){return this===e||e instanceof s&&Cesium.Property.equals(this._color,e._color)},Cesium.Material.PolylineTrailType="PolylineTrail",Cesium.Material.PolylineTrailImage="images/colors.png",Cesium.Material.PolylineTrailSource="czm_material czm_getMaterial(czm_materialInput materialInput)\n                                                 {\n                                                      czm_material material = czm_getDefaultMaterial(materialInput);\n                                                      vec2 st = materialInput.st;\n                                                      vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n                                                      material.alpha = colorImage.a * color.a;\n                                                      material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n                                                      return material;\n                                                  }",Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType,{fabric:{type:Cesium.Material.PolylineTrailType,uniforms:{color:new Cesium.Color(1,0,0,.5),image:Cesium.Material.PolylineTrailImage,time:0},source:Cesium.Material.PolylineTrailSource},translucent:function(){return!0}}),Cesium.PolylineTrailMaterialProperty=s;var l={deviationR:1,minR:0,maxR:100},u=l.minR;function d(){var e=new Cesium.CallbackProperty((function(){return u}),!1);return e}function c(){var e=new Cesium.CallbackProperty((function(){return u+=l.deviationR/10,u>=l.maxR&&(u=l.minR),u}),!1);return e}function m(){var e=new Cesium.CallbackProperty((function(){var e=1-u/100;return Cesium.Color.WHITE.withAlpha(e)}),!1);return e}function C(){var e=!0,i=1,t=new window.Cesium.CallbackProperty((function(){return e?(i-=.03,e=!(i<=0)):(i+=.03,e=i>=1),window.Cesium.Color.WHITE.withAlpha(i)}),!1);return t}function p(){var e=!0,i=1,t=new window.Cesium.CallbackProperty((function(){return e?(i-=.02,e=!(i<=.8)):(i+=.02,e=i>=1.4),i}),!1);return t}function A(e,i){var t=new Cesium.Cartesian3;Cesium.Cartesian3.add(e,i,t);var a=new Cesium.Cartesian3;Cesium.Cartesian3.divideByScalar(t,2,a);var n=Cesium.Cartographic.fromCartesian(a);n.height=Cesium.Cartesian3.distance(e,i);var r=new Cesium.Cartesian3;Cesium.Ellipsoid.WGS84.cartographicToCartesian(n,r);for(var o=new Cesium.CatmullRomSpline({times:[0,.5,1],points:[e,r,i]}),s=[],l=0,u=200;l<u;l++)s.push(o.evaluate(l/u));return s}var g=t("7b71"),h={data:function(){return{srcList:[],url:"",points:[{id:102881,latitude:31.85376,longitude:120.217137,altitude:90,heading:-2,action:[{src:"https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",id:164260,yaw:100,roll:100,pitch:100}]},{id:102882,latitude:31.8554312,longitude:120.216864,altitude:82.5,heading:90,action:[]},{id:102883,latitude:31.8556587,longitude:120.2185077,altitude:92.6,heading:180,action:[{src:"https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",id:164262,yaw:0,roll:0,pitch:45}]},{id:102884,latitude:31.856109,longitude:120.2218049,altitude:93.4,heading:270,action:[]},{id:102886,latitude:31.8559722,longitude:120.2218505,altitude:62.27,heading:360,action:[{src:"https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",id:164264,yaw:0,roll:0,pitch:1.7}]},{id:102887,latitude:31.8559748,longitude:120.2218342,altitude:58.18,heading:270,action:[{src:"https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",id:164266,yaw:-1.4,roll:0,pitch:1.9}]},{id:102888,latitude:31.8559665,longitude:120.2218342,altitude:51.39,heading:180,action:[{src:"https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",id:164268,yaw:-2,roll:0,pitch:1.7}]},{id:102889,latitude:31.8559705,longitude:120.2218332,altitude:44.96,heading:90,action:[]},{id:102892,latitude:31.8562512,longitude:120.2217962,altitude:62.04,heading:0,action:[{src:"https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",id:164271,yaw:0,roll:0,pitch:1.7}]},{id:102893,latitude:31.8562451,longitude:120.2217842,altitude:58.18,heading:0,action:[]},{id:102894,latitude:31.8562542,longitude:120.2217819,altitude:51.42,heading:0,action:[]},{id:102895,latitude:31.8562497,longitude:120.2217814,altitude:44.99,heading:0,action:[{src:"https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",id:164276,yaw:-2.2,roll:0,pitch:2}]}]}},computed:{},watch:{},mounted:function(){Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM";var e=new Cesium.Viewer("cesium-container",{terrainProvider:Cesium.createWorldTerrain(),animation:!1,baseLayerPicker:!1,fullscreenButton:!1,vrButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,timeline:!1,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!0,imageryProvider:new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"})});e.entities.removeAll(),this.points.map((function(i,a){i.actionEntityList&&i.actionEntityList.length;var n=Object(g["b"])(i.longitude,i.latitude,i.heading,20);e.entities.add(new Cesium.Entity({id:"heading"+a,name:"headingLine",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights([i.longitude,i.latitude,i.altitude,n.longitude,n.latitude,i.altitude]),width:10,material:new Cesium.PolylineArrowMaterialProperty(new Cesium.Color.fromCssColorString("#fff").withAlpha(1)),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0,7e3)}})),e.entities.add(new Cesium.Entity({id:"point"+i.id,name:"point",position:Cesium.Cartesian3.fromDegrees(i.longitude,i.latitude,i.altitude),data:{point:i},billboard:{image:t("4fc8"),verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,scale:1,scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0,7e3),show:!0},label:{text:i.id+"",style:Cesium.LabelStyle.FILL_AND_OUTLINE,fillColor:new Cesium.Color.fromCssColorString("#f00"),outlineColor:new Cesium.Color.fromCssColorString("#fff"),outlineWidth:1,verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,showBackground:!1,backgroundColor:new Cesium.Color.fromCssColorString("#fff"),distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0,7e3),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),show:!0}}))}));var i=[];this.points.map((function(e,t){i.push(e.longitude),i.push(e.latitude),i.push(e.altitude)}));var a=new Cesium.PolygonGeometry({polygonHierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(i))}),n=Cesium.PolygonGeometry.createGeometry(a),r=n.boundingSphere.center,o=Cesium.Cartographic.fromCartesian(r,e.scene.globe.ellipsoid,new Cesium.Cartographic),s=Cesium.Math.toDegrees(o.longitude),l=Cesium.Math.toDegrees(o.latitude),u=(e.entities.add(new Cesium.Entity({position:Cesium.Cartesian3.fromDegrees(s,l,0),point:new Cesium.PointGraphics({pixelSize:40,heightReference:Cesium.HeightReference.NONE,color:new Cesium.Color.fromCssColorString("#FCB718").withAlpha(1),outlineColor:new Cesium.Color.fromCssColorString("#FCB718").withAlpha(1),outlineWidth:1,pixelOffset:new Cesium.Cartesian2(0,0),show:!0})})),e.entities.add(new Cesium.Entity({id:"line",name:"line",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights(i),width:2,arcType:Cesium.ArcType.RHUMB,material:new Cesium.PolylineDashMaterialProperty({color:new Cesium.Color.fromCssColorString("#FCB718").withAlpha(1),dashLength:5}),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0,7e3)}})));e.flyTo(u,{duration:1,offset:new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-30),Cesium.Math.toRadians(-45),Cesium.Math.toRadians(0))});var h=this.points[0],f=this.points[1],w=this.points[2];e.entities.add({position:Cesium.Cartesian3.fromDegrees(h.longitude,h.latitude,h.altitude),ellipse:{semiMinorAxis:d(),semiMajorAxis:c(),height:100,material:Cesium.Color.RED.withAlpha(.5),outlineColor:Cesium.Color.RED}}),e.entities.add({position:Cesium.Cartesian3.fromDegrees(f.longitude,f.latitude,f.altitude),ellipse:{semiMinorAxis:d(),semiMajorAxis:c(),height:f.altitude,material:new Cesium.ImageMaterialProperty({image:t("ad57"),repeat:new Cesium.Cartesian2(1,1),transparent:!0,color:m()})}});var y=e.entities.getById("point102883");y.billboard.color=C(),y.billboard.scale=p();var b=new Cesium.PolylineTrailMaterialProperty({color:Cesium.Color.RED,duration:3e3,trailImage:t("76a3")}),v=A(Cesium.Cartesian3.fromDegrees(h.longitude,h.latitude,h.altitude),Cesium.Cartesian3.fromDegrees(f.longitude,f.latitude,f.altitude));e.entities.add({polyline:{positions:v,width:5,material:b}});e.entities.add({name:"glb 模型",position:new Cesium.Cartesian3.fromDegrees(w.longitude,w.latitude,w.altitude),model:{uri:"model/Cesium_Air.glb",minimumPixelSize:256,maxumunScale:2e4}})},methods:{}},f=h,w=(t("c432"),t("2877")),y=Object(w["a"])(f,a,n,!1,null,null,null);i["default"]=y.exports},"4fc8":function(e,i,t){e.exports=t.p+"20221212184220/img/point.4fe971e2.png"},"76a3":function(e,i){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAgCAYAAABkS8DlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAISSURBVHja7NbLjuIwEAXQchKY///cbmJ7FnHAGENLM8s+RypV2QkPBQvdVGuNSGmNiC0i1oi4tPnS6tr1a0T8mfR3dR3msS5DbUP13+usZVKpm9fJfopRGl61TN6h759qm8zbZJ6tP9X6D/esH/qnWn54wuPTbs+uRkSJ1PpZ6WXObc5tP0/mPMz7OdeIXFPsrecax1wee3uN2Et3X7u21xS5HP1+vTzfc/Tn67lG64/1eV+uKfJ5z33uqq1Lt1dqihxLlG6/RIpSl9ZTlHa9xjHXp+PbPfzU/RjpQ09rt16f96b9zbzMrp37w15aIpYtIm1H7+d7X5/nHw/o8uZgpuFAprgfxNz1e7WDs5eut7q12kvELR/zd25zq++h59KqdvOHdRmv1de9Ul+vnXtlMpf6uKevOq7jtdcaUSKWGpHq0Wd/ou//BtNT37r1du/pvr9162Mvtb+t9LGuscT1pR/zZdIvT/2oLZbp5z++f+pPT39ySrSn1VWZ9HHOk/fqa4+IW+vfbb61+ayvrvc12/saXjPWrfu82/kdlgAAfh0BAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAAPh/fwEAAP//AwAf9mMXHR2/kAAAAABJRU5ErkJggg=="},"7b71":function(e,i,t){"use strict";t.d(i,"c",(function(){return a})),t.d(i,"a",(function(){return n})),t.d(i,"d",(function(){return r})),t.d(i,"e",(function(){return o})),t.d(i,"b",(function(){return s}));t("2ef0"),t("595b");function a(e,i,t,a){var n=viewer,s=n.scene,l=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),u=r({longitude:e.longitude,latitude:e.latitude,altitude:e.altitude},parseFloat(i+t.yaw)),d=a*Math.cos(t.pitch*Math.PI/180);l=o(l,u,d);var c=a*Math.sin(t.pitch*Math.PI/180),m=s.globe.ellipsoid.cartesianToCartographic(l),C=Cesium.Math.toDegrees(m.latitude),p=Cesium.Math.toDegrees(m.longitude);return l=new Cesium.Cartesian3.fromDegrees(p,C,e.altitude-c),l}function n(e,i){var t=Cesium.Ellipsoid.WGS84.cartesianToCartographic(e),a=Cesium.Math.toDegrees(t.longitude),n=Cesium.Math.toDegrees(t.latitude),r={longitude:parseFloat(parseFloat(a).toFixed(7)),latitude:parseFloat(parseFloat(n).toFixed(7)),altitude:parseFloat(t.height)};return r}function r(e,i){var t=new Cesium.Cartesian3.fromDegrees(parseFloat(e.longitude),parseFloat(e.latitude),parseFloat(e.altitude)),a=new Cesium.Cartesian3.fromDegrees(parseFloat(e.longitude),parseFloat(e.latitude)+1e-4,parseFloat(e.altitude)),n=Cesium.Cartographic.fromCartesian(a);n.height=0;var r=Cesium.Cartographic.toCartesian(n),o=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(r,a,new Cesium.Cartesian3),new Cesium.Cartesian3),s=Cesium.Quaternion.fromAxisAngle(o,Cesium.Math.toRadians(i)),l=Cesium.Matrix3.fromQuaternion(s),u=Cesium.Matrix4.fromRotationTranslation(l),d=Cesium.Cartesian3.subtract(a,t,new Cesium.Cartesian3),c=Cesium.Matrix4.multiplyByPoint(u,d,new Cesium.Cartesian3);return c}function o(e,i,t){var a=Cesium.Cartesian3.normalize(i,new Cesium.Cartesian3),n=Cesium.Cartesian3.multiplyByScalar(a,t,new Cesium.Cartesian3);return Cesium.Cartesian3.add(e,n,new Cesium.Cartesian3)}function s(e,i,t,a){return{longitude:e+a*Math.sin(t*Math.PI/180)*180/(6371229*Math.PI*Math.cos(i*Math.PI/180)),latitude:i+a*Math.cos(t*Math.PI/180)/(6371229*Math.PI/180)}}},ad57:function(e,i,t){e.exports=t.p+"20221212184220/img/circle.96d9c80b.png"},bee2:function(e,i,t){"use strict";function a(e,i){for(var t=0;t<i.length;t++){var a=i[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function n(e,i,t){return i&&a(e.prototype,i),t&&a(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}t.d(i,"a",(function(){return n}))},c432:function(e,i,t){"use strict";t("ee73")},d4ec:function(e,i,t){"use strict";function a(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}t.d(i,"a",(function(){return a}))},ee73:function(e,i,t){}}]);