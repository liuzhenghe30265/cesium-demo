(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0589c9be"],{6490:function(e,i,t){"use strict";t.r(i);var r=function(){var e=this;e._self._c;return e._m(0)},n=[function(){var e=this,i=e._self._c;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[i("div",{staticClass:"btn_container"},[i("button",{attrs:{id:"clear"}},[e._v("清除")])])])}],o=(t("96cf"),t("3b8d")),a=t("595b"),s={data:function(){return{_primitive:null}},computed:{},watch:{},mounted:function(){var e=this,i=this;window.$InitMap();var t=a["randomPoint"](1e3,{bbox:[70.01180980018789,20.12881664932077,134.27620577723778,50.568644557429835]}).features.map((function(e,i){return{longitude:e.geometry.coordinates[0],latitude:e.geometry.coordinates[1],altitude:i,value:i}}));viewer.camera.flyTo({destination:Cesium.Rectangle.fromDegrees(70.01180980018789,20.12881664932077,134.27620577723778,50.568644557429835)}),viewer.scene.renderError.addEventListener((function(){alert("内存超出100%")})),this.$nextTick(Object(o["a"])(regeneratorRuntime.mark((function i(){return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,e.$worker.run((function(e){for(var i=[],t=Math.ceil(e.length/10),r=0;r<t;r++)i.push(e.slice(10*r,10*(r+1)));return i}),[t]);case 2:i.sent;case 4:case"end":return i.stop()}}),i)}))));var r=0,n=[];viewer.scene.preUpdate.addEventListener((function(){r-=Math.PI/180,n.map((function(e){e.appearance.material.uniforms.radians=r}))})),document.getElementById("clear").onclick=function(){for(var e in primitiveObj)if(Object.hasOwnProperty.call(primitiveObj,e)){var t=primitiveObj[e];viewer.scene.primitives.remove(t)}var r=viewer.entities.getById("bar");r&&r._children.map((function(e){viewer.entities.remove(e)})),i._primitive&&viewer.scene.primitives.remove(i._primitive)};var s=[];t.map((function(e,i){var t=new Cesium.Color(1,1,1,.3),r=Cesium.ColorBlendMode.HIGHLIGHT;i%2===0&&(t=new Cesium.Color(0,1,1,.3),r=Cesium.ColorBlendMode.MIX);var n=Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,1e4)),o=viewer.scene.primitives.add(Cesium.Model.fromGltf({url:"model/Cesium_Air.glb",scale:1e3,id:"Model"+i,allowPicking:!0,show:!0,color:t,colorBlendMode:r,modelMatrix:n})),a=Cesium.HeadingPitchRoll.fromDegrees(30,30,30),c=Cesium.Matrix3.fromHeadingPitchRoll(a),u=o.modelMatrix;Cesium.Matrix4.multiplyByMatrix3(u,c,u),o.modelMatrix=u,s.push(new Cesium.GeometryInstance({id:"CircleGeometry_"+i,geometry:new Cesium.CircleGeometry({center:Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),radius:5e3}),attributes:{color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha:1})),show:new Cesium.ShowGeometryInstanceAttribute(!0)}}))})),this._primitive=new Cesium.Primitive({geometryInstances:s,appearance:new Cesium.PerInstanceColorAppearance({})}),viewer.scene.primitives.add(this._primitive);var c=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);c.setInputAction((function(e){var t=viewer.scene.pick(e.position);if(Cesium.defined(t)&&t.id){var r=i._primitive.getGeometryInstanceAttributes(t.id);r&&(r.color=Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({alpha:1})))}}),Cesium.ScreenSpaceEventType.LEFT_CLICK)},methods:{}},c=s,u=(t("9dc7"),t("2877")),m=Object(u["a"])(c,r,n,!1,null,null,null);i["default"]=m.exports},"9dc7":function(e,i,t){"use strict";t("db8f")},db8f:function(e,i,t){}}]);