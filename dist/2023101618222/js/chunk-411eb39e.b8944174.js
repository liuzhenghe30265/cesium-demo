(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-411eb39e"],{ac6a:function(e,t,i){for(var r=i("cadf"),o=i("0d58"),n=i("2aba"),a=i("7726"),s=i("32e9"),l=i("84f2"),u=i("2b4c"),c=u("iterator"),m=u("toStringTag"),h=l.Array,g={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=o(g),f=0;f<d.length;f++){var p,C=d[f],y=g[C],L=a[C],b=L&&L.prototype;if(b&&(b[c]||s(b,c,h),b[m]||s(b,m,C),l[C]=h,y))for(p in r)b[p]||n(b,p,r[p],!0)}},af22:function(e,t,i){"use strict";i.r(t);var r=function(){var e=this;e._self._c;return e._m(0)},o=[function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[t("span",{staticStyle:{position:"absolute",right:"50px",top:"50px","z-index":"999","font-size":"24px",color:"#fff",cursor:"pointer"},attrs:{id:"button"}},[e._v("淹没分析")])])}],n=(i("ac6a"),i("595b")),a={data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap();var e=new Cesium.Cesium3DTileset({url:"https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json",debugShowMemoryUsage:!1});viewer.scene.primitives.add(e),viewer.zoomTo(e);var t=viewer.entities.add({polygon:{hierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights([121.4631015,31.2671618,0,121.5367499,31.2658501,0,121.5328263,31.2059886,0,121.4590159,31.2055623,0])),material:new Cesium.ColorMaterialProperty(new Cesium.Color.fromCssColorString("#17E980").withAlpha(0))}});function i(){for(var e=t.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions,i=[],r=0;r<e.length;r++){var o=viewer.scene.globe.ellipsoid.cartesianToCartographic(e[r]),a=Cesium.Math.toDegrees(o.latitude),s=Cesium.Math.toDegrees(o.longitude);i.push([s,a])}var l=Object(n["lineString"])(i),u=Object(n["bbox"])(l),c=Object(n["bboxPolygon"])(u),m=Object(n["area"])(c),h=Math.sqrt(m/1e6)/100,g={units:"kilometers"},d=Object(n["pointGrid"])(u,h,g),f=[];d.features.forEach((function(e){f.push(Cesium.Cartographic.fromDegrees(e.geometry.coordinates[0],e.geometry.coordinates[1]))}));var p=Cesium.sampleTerrainMostDetailed(viewer.terrainProvider,f),C=100,y=0;Promise.resolve(p).then((function(e){for(var i=0;i<e.length;i++){var r=e[i].height;y=r<y?r:y,C=r>C?r:C}var o={minHeight:y,maxHeight:C},n=o.minHeight,a=o.maxHeight;return t.polygon.perPositionHeight=!0,t.polygon.material=new Cesium.Color.fromBytes(64,157,253,150),t.polygon.extrudedHeight=new Cesium.CallbackProperty((function(){return n+=.5,n>a&&(n=a),n}),!1),o}))}document.getElementById("button").onclick=function(){i()}},methods:{}},s=a,l=i("2877"),u=Object(l["a"])(s,r,o,!1,null,null,null);t["default"]=u.exports}}]);