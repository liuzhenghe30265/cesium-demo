(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-506ca04c"],{"567f":function(e,o,i){"use strict";i.r(o);var t=function(){var e=this,o=e._self._c;return o("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}})},n=[],r=i("7b71"),s=(i("a483"),{data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap();var e=new Cesium.Cesium3DTileset({url:"https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json",debugShowMemoryUsage:!1});viewer.scene.primitives.add(e),viewer.zoomTo(e);var o=[],t=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);t.setInputAction((function(e){var i=viewer.camera.getPickRay(e.position),t=viewer.scene.globe.pick(i,viewer.scene),n=viewer.scene.pickPosition(e.position),s=viewer.scene.pick(e.position),a=null;a=n&&s&&!s.id?n:t,a&&o.push(Object(r["a"])(a))}),Cesium.ScreenSpaceEventType.LEFT_CLICK);var n=new Cesium.PolylineCollection;viewer.scene.primitives.add(n);var s=new Cesium.PointPrimitiveCollection;viewer.scene.primitives.add(s);var a=new Cesium.LabelCollection;viewer.scene.primitives.add(a);var c=null;c=new Cesium.GroundPrimitive({geometryInstances:[],appearance:new Cesium.PerInstanceColorAppearance({})}),viewer.scene.primitives.add(c);var l=i("e372");l.map((function(e){if(e.objectInfo&&"polygon"===e.objectInfo.drawingMode){var o="".concat(e.id,"_plotPolygon"),i=[];e.objectInfo.activeShapePoints.map((function(e){i.push(e.longitude),i.push(e.latitude),i.push(e.altitude)}));var t=e.objectInfo.colorValue?new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(e.objectInfo.colorValue.hex8)):new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#0000ff").withAlpha(.4));new Cesium.GeometryInstance({geometry:new Cesium.PolygonGeometry({polygonHierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(i)),perPositionHeight:!0,closeTop:!0,closeBottom:!0,arcType:Cesium.ArcType.RHUMB,vertexFormat:Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT}),id:o,attributes:{color:t,show:new Cesium.ShowGeometryInstanceAttribute(!0)}});c&&c.geometryInstances&&c.geometryInstances.push(new Cesium.GeometryInstance({geometry:new Cesium.PolygonGeometry({polygonHierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(i)),perPositionHeight:!0,closeTop:!0,closeBottom:!0,arcType:Cesium.ArcType.RHUMB,vertexFormat:Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT}),id:o,attributes:{color:t,show:new Cesium.ShowGeometryInstanceAttribute(!0)}}))}if(e.objectInfo&&"polyline"===e.objectInfo.drawingMode){var r="".concat(e.id,"_plotPolyline"),l=[];e.objectInfo.activeShapePoints.map((function(e){l.push(e.longitude),l.push(e.latitude),l.push(e.altitude)}));e.objectInfo.colorValue?new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(e.objectInfo.colorValue.hex8)):new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#0000ff").withAlpha(.4));n&&n instanceof Cesium.PolylineCollection&&n.add({id:r,positions:Cesium.Cartesian3.fromDegreesArrayHeights(l),width:2,material:Cesium.Material.fromType("Color",{color:Cesium.Color.fromCssColorString("#f60").withAlpha(1)})});var u=new Cesium.GeometryInstance({geometry:new Cesium.SimplePolylineGeometry({positions:Cesium.Cartesian3.fromDegreesArrayHeights(l),colors:[],colorsPerVertex:!0}),id:r});viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:[u],appearance:new Cesium.PerInstanceColorAppearance({material:Cesium.Color.RED.withAlpha(.4),flat:!0,translucent:!0})}))}e.objectInfo&&"point"===e.objectInfo.drawingMode&&s&&s instanceof Cesium.PointPrimitiveCollection&&s.add({position:Cesium.Cartesian3.fromDegrees(e.objectInfo.centerPoint.longitude,e.objectInfo.centerPoint.latitude,e.objectInfo.centerPoint.altitude),pixelSize:10,outlineColor:Cesium.Color.TRANSPARENT,outlineWidth:0,color:Cesium.Color.YELLOW}),e.objectInfo&&"text"===e.objectInfo.drawingMode&&a&&a instanceof Cesium.LabelCollection&&a.add({position:Cesium.Cartesian3.fromDegrees(e.objectInfo.centerPoint.longitude,e.objectInfo.centerPoint.latitude,e.objectInfo.centerPoint.altitude),text:e.id+"",color:Cesium.Color.YELLOW})}))},methods:{}}),a=s,c=(i("c820"),i("2877")),l=Object(c["a"])(a,t,n,!1,null,null,null);o["default"]=l.exports},ba1f:function(e,o,i){},c820:function(e,o,i){"use strict";i("ba1f")}}]);