(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6800e320"],{"3b18":function(e,i,t){"use strict";t.r(i);var n=function(){var e=this;e._self._c;return e._m(0)},a=[function(){var e=this,i=e._self._c;return i("div",{staticStyle:{width:"100%",height:"100%"}},[i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}}),i("div",{staticClass:"btns"},[i("i",{staticClass:"el-icon-arrow-left",attrs:{id:"left"}}),i("i",{staticClass:"el-icon-arrow-right",attrs:{id:"right"}}),i("i",{staticClass:"el-icon-arrow-up",attrs:{id:"up"}}),i("i",{staticClass:"el-icon-arrow-down",attrs:{id:"down"}})])])}],r=t("904f"),s={data:function(){return{}},computed:{},watch:{},mounted:function(){window.$InitMap();var e=null,i=Object(r["a"])("https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json",new Cesium.ClippingPlaneCollection({planes:[new Cesium.ClippingPlane(new Cesium.Cartesian3(1,0,0),0)],unionClippingRegions:!0})),t=Object(r["a"])("https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json",new Cesium.ClippingPlaneCollection({planes:[new Cesium.ClippingPlane(new Cesium.Cartesian3(-1,0,0),0)],unionClippingRegions:!0}));function n(n){e&&clearInterval(e),e=setInterval((function(){if("left"===n){if(i.clippingPlanes.get(0).distance>3500)return void clearInterval(e);i.clippingPlanes.get(0).distance+=10,t.clippingPlanes.get(0).distance-=10}else if("right"===n){if(t.clippingPlanes.get(0).distance>3500)return void clearInterval(e);t.clippingPlanes.get(0).distance+=10,i.clippingPlanes.get(0).distance-=10}else if("up"===n){if(t.clippingPlanes.get(1).distance>250)return void clearInterval(e);t.clippingPlanes.get(1).distance+=10,i.clippingPlanes.get(1).distance-=10}else if("down"===n){if(i.clippingPlanes.get(1).distance>250)return void clearInterval(e);i.clippingPlanes.get(1).distance+=10,t.clippingPlanes.get(1).distance-=10}}),10)}viewer.zoomTo(i);var a=document.getElementById("left");a.onclick=function(){n("left")};var s=document.getElementById("right");s.onclick=function(){n("right")}},methods:{}},l=s,o=t("2877"),c=Object(o["a"])(l,n,a,!1,null,"1503e4ce",null);i["default"]=c.exports},"904f":function(e,i,t){"use strict";t.d(i,"b",(function(){return a})),t.d(i,"a",(function(){return r}));t("ac6a");var n=t("595b");function a(e,i,t){e.readyPromise.then((function(e){for(var n=c(e),a=i,r=s(a,!t),l=[],u=0;u<r.length-1;u++){var m=o(r[u],r[u+1],n);l.push(m)}var p=new Cesium.ClippingPlaneCollection({planes:l,unionClippingRegions:t,edgeWidth:1});e.clippingPlanes=p}))}function r(e,i){var t={url:e,maximumScreenSpaceError:8,clippingPlanes:i},n=viewer.scene.primitives.add(new Cesium.Cesium3DTileset(t));return n.readyPromise.then((function(e){if(!Cesium.Matrix4.equals(e.root.transform,Cesium.Matrix4.IDENTITY)){var t=Cesium.Matrix4.getTranslation(e.root.transform,new Cesium.Cartesian3),n=Cesium.Cartographic.fromCartesian(t),a=Cesium.Cartographic.fromCartesian(e.boundingSphere.center),r=a.height-n.height;return i.modelMatrix=Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0,0,r)),e}})),n}function s(e,i){var t=[];e.forEach((function(e){t.push([e[0],e[1]])}));var a=Object(n["lineString"])(t),r=Object(n["booleanClockwise"])(a),s=[];if(i)if(r)for(var l=0,o=e.length-1;o>=0;o--)s[l]=e[o],l++;else s=e;else if(r)s=e;else for(var c=0,u=e.length-1;u>=0;u--)s[c]=e[u],c++;return s}function l(e,i){var t=Cesium.Cartesian3.fromDegrees(e[0],e[1]);return Cesium.Matrix4.multiplyByPoint(i,t,new Cesium.Cartesian3(0,0,0))}function o(e,i,t){var n=l(e,t),a=l(i,t),r=new Cesium.Cartesian3(0,0,10),s=Cesium.Cartesian3.subtract(a,n,new Cesium.Cartesian3),o=Cesium.Cartesian3.cross(s,r,new Cesium.Cartesian3);o=Cesium.Cartesian3.normalize(o,o);var c=Cesium.Plane.fromPointNormal(n,o);return Cesium.ClippingPlane.fromPlane(c)}function c(e){var i,t=e.root.transform;return i=t&&t.equals(Cesium.Matrix4.IDENTITY)||!t?Cesium.Transforms.eastNorthUpToFixedFrame(e.boundingSphere.center):Cesium.Matrix4.fromArray(e.root.transform),Cesium.Matrix4.inverseTransformation(i,new Cesium.Matrix4)}},ac6a:function(e,i,t){for(var n=t("cadf"),a=t("0d58"),r=t("2aba"),s=t("7726"),l=t("32e9"),o=t("84f2"),c=t("2b4c"),u=c("iterator"),m=c("toStringTag"),p=o.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},C=a(f),d=0;d<C.length;d++){var g,h=C[d],v=f[h],w=s[h],P=w&&w.prototype;if(P&&(P[u]||l(P,u,p),P[m]||l(P,m,h),o[h]=p,v))for(g in n)P[g]||r(P,g,n[g],!0)}}}]);