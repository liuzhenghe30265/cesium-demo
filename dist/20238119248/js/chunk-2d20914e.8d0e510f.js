(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d20914e"],{a812:function(e,n,t){"use strict";t.r(n);var i=function(){var e=this,n=e._self._c;return n("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}})},a=[],c={data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap(),viewer.camera.flyTo({destination:Cesium.Rectangle.fromDegrees(100,10,120,70)}),viewer.scene.camera.moveEnd.addEventListener((function(){})),viewer.camera.percentageChanged=1e-5,viewer.camera.changed.addEventListener((function(e){}));var e=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);e.setInputAction((function(e){var n=viewer.camera.pickEllipsoid(e.position,viewer.scene.globe.ellipsoid),t=Cesium.Cartographic.fromCartesian(n,viewer.scene.globe.ellipsoid,new Cesium.Cartographic);Cesium.Math.toDegrees(t.longitude),Cesium.Math.toDegrees(t.latitude)}),Cesium.ScreenSpaceEventType.LEFT_CLICK),e.setInputAction((function(e){}),Cesium.ScreenSpaceEventType.MOUSE_MOVE)},methods:{}},r=c,s=t("2877"),o=Object(s["a"])(r,i,a,!1,null,null,null);n["default"]=o.exports}}]);