(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6b3eb548"],{c6ec:function(e,i,t){"use strict";t.r(i);var n=function(){var e=this,i=e._self._c;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}})},r=[],a={data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap(),viewer.scene.camera.moveEnd.addEventListener((function(){})),viewer.camera.percentageChanged=1e-5,viewer.camera.changed.addEventListener((function(e){}));var e=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);e.setInputAction((function(e){var i=viewer.camera.pickEllipsoid(e.position,viewer.scene.globe.ellipsoid),n=Cesium.Cartographic.fromCartesian(i,viewer.scene.globe.ellipsoid,new Cesium.Cartographic),r=Cesium.Math.toDegrees(n.longitude),a=Cesium.Math.toDegrees(n.latitude),s=viewer.entities.add(new Cesium.Entity({position:Cesium.Cartesian3.fromDegrees(r,a,100),point:new Cesium.PointGraphics({pixelSize:10,show:!0})})),o=new Cesium.ParticleSystem({image:t("ffd4"),imageSize:new Cesium.Cartesian2(20,20),startColor:new Cesium.Color(1,.6588235294117647,.07450980392156863,1),endColor:new Cesium.Color(0,0,0,.1),startScale:2,endScale:5,particleLife:1,speed:5,emitter:new Cesium.CircleEmitter(.8),modelMatrix:s.computeModelMatrix(viewer.clock.startTime,new Cesium.Matrix4),lifetime:16,particleSize:57,emissionRate:21,emitterRadius:4});viewer.scene.primitives.add(o)}),Cesium.ScreenSpaceEventType.LEFT_CLICK)},methods:{}},s=a,o=t("2877"),c=Object(o["a"])(s,n,r,!1,null,null,null);i["default"]=c.exports},ffd4:function(e,i,t){e.exports=t.p+"202392173517/img/smoke.7c77c771.png"}}]);