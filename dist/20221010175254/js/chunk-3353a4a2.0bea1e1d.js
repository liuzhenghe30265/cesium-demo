(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3353a4a2"],{"1a4a":function(e,i,t){},"7b71":function(e,i,t){"use strict";function a(e){var i=e.camera.computeViewRectangle(),t={};if("undefined"===typeof i){var a=function(e,i,t){var a=e.camera,n=e.scene,r=new Cesium.Cartesian2(i,t),s=n.globe.ellipsoid,o=a.pickEllipsoid(r,s),u=n.globe.ellipsoid.cartesianToCartographic(o),c=Cesium.Math.toDegrees(u.longitude),m=Cesium.Math.toDegrees(u.latitude);return{lon:c,lat:m}},n=e.scene.canvas,r=a(e,0,0),s=a(e,n.clientWidth,n.clientHeight);t.xmin=r.lon,t.xmax=s.lon,t.ymin=r.lat,t.ymax=s.lat}else t.xmax=Cesium.Math.toDegrees(i.east),t.ymax=Cesium.Math.toDegrees(i.north),t.xmin=Cesium.Math.toDegrees(i.west),t.ymin=Cesium.Math.toDegrees(i.south);return t}function n(e,i,t,a){return{longitude:e+a*Math.sin(t*Math.PI/180)*180/(6371229*Math.PI*Math.cos(i*Math.PI/180)),latitude:i+a*Math.cos(t*Math.PI/180)/(6371229*Math.PI/180)}}function r(e,i){var t=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),a=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude+1e-4,e.altitude),n=Cesium.Cartographic.fromCartesian(a);n.height=0;var r=Cesium.Cartographic.toCartesian(n),s=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(r,a,new Cesium.Cartesian3),new Cesium.Cartesian3),o=Cesium.Quaternion.fromAxisAngle(s,Cesium.Math.toRadians(i)),u=Cesium.Matrix3.fromQuaternion(o),c=Cesium.Matrix4.fromRotationTranslation(u),m=Cesium.Cartesian3.subtract(a,t,new Cesium.Cartesian3),l=Cesium.Matrix4.multiplyByPoint(c,m,new Cesium.Cartesian3);return l}function s(e,i,t){var a=Cesium.Cartesian3.normalize(i,new Cesium.Cartesian3),n=Cesium.Cartesian3.multiplyByScalar(a,t,new Cesium.Cartesian3);return Cesium.Cartesian3.add(e,n,new Cesium.Cartesian3)}i["a"]={getExtend:a,translateByDirection:s,getVector:r,distancePos:n}},a812:function(e,i,t){"use strict";t.r(i);var a=function(){var e=this,i=e._self._c;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}})},n=[],r=(t("7b71"),{data:function(){return{}},computed:{},watch:{},mounted:function(){Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM";var e=new Cesium.Viewer("cesium-container",{terrainProvider:Cesium.createWorldTerrain(),animation:!1,baseLayerPicker:!1,fullscreenButton:!1,vrButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,timeline:!1,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!0,imageryProvider:new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"})});e.camera.flyTo({destination:Cesium.Rectangle.fromDegrees(100,10,120,70)}),e.scene.camera.moveEnd.addEventListener((function(){})),e.camera.percentageChanged=1e-5,e.camera.changed.addEventListener((function(e){}));var i=new Cesium.ScreenSpaceEventHandler(e.scene.canvas);i.setInputAction((function(i){var t=e.camera.pickEllipsoid(i.position,e.scene.globe.ellipsoid),a=Cesium.Cartographic.fromCartesian(t,e.scene.globe.ellipsoid,new Cesium.Cartographic);Cesium.Math.toDegrees(a.longitude),Cesium.Math.toDegrees(a.latitude)}),Cesium.ScreenSpaceEventType.LEFT_CLICK),i.setInputAction((function(e){}),Cesium.ScreenSpaceEventType.MOUSE_MOVE)},methods:{}}),s=r,o=(t("a921"),t("2877")),u=Object(o["a"])(s,a,n,!1,null,null,null);i["default"]=u.exports},a921:function(e,i,t){"use strict";t("1a4a")}}]);