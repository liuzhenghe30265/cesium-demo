(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-08410770"],{"904f":function(e,i,t){"use strict";t.d(i,"b",(function(){return r})),t.d(i,"a",(function(){return s}));t("ac6a");var n=t("595b");function r(e,i,t){e.readyPromise.then((function(e){for(var n=l(e),r=i,s=a(r,!t),o=[],c=0;c<s.length-1;c++){var m=u(s[c],s[c+1],n);o.push(m)}var C=new Cesium.ClippingPlaneCollection({planes:o,unionClippingRegions:t,edgeWidth:1});e.clippingPlanes=C}))}function s(e,i){var t={url:e,maximumScreenSpaceError:8,clippingPlanes:i},n=viewer.scene.primitives.add(new Cesium.Cesium3DTileset(t));return n.readyPromise.then((function(e){if(!Cesium.Matrix4.equals(e.root.transform,Cesium.Matrix4.IDENTITY)){var t=Cesium.Matrix4.getTranslation(e.root.transform,new Cesium.Cartesian3),n=Cesium.Cartographic.fromCartesian(t),r=Cesium.Cartographic.fromCartesian(e.boundingSphere.center),s=r.height-n.height;return i.modelMatrix=Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0,0,s)),e}})),n}function a(e,i){var t=[];e.forEach((function(e){t.push([e[0],e[1]])}));var r=Object(n["lineString"])(t),s=Object(n["booleanClockwise"])(r),a=[];if(i)if(s)for(var o=0,u=e.length-1;u>=0;u--)a[o]=e[u],o++;else a=e;else if(s)a=e;else for(var l=0,c=e.length-1;c>=0;c--)a[l]=e[c],l++;return a}function o(e,i){var t=Cesium.Cartesian3.fromDegrees(e[0],e[1]);return Cesium.Matrix4.multiplyByPoint(i,t,new Cesium.Cartesian3(0,0,0))}function u(e,i,t){var n=o(e,t),r=o(i,t),s=new Cesium.Cartesian3(0,0,10),a=Cesium.Cartesian3.subtract(r,n,new Cesium.Cartesian3),u=Cesium.Cartesian3.cross(a,s,new Cesium.Cartesian3);u=Cesium.Cartesian3.normalize(u,u);var l=Cesium.Plane.fromPointNormal(n,u);return Cesium.ClippingPlane.fromPlane(l)}function l(e){var i,t=e.root.transform;return i=t&&t.equals(Cesium.Matrix4.IDENTITY)||!t?Cesium.Transforms.eastNorthUpToFixedFrame(e.boundingSphere.center):Cesium.Matrix4.fromArray(e.root.transform),Cesium.Matrix4.inverseTransformation(i,new Cesium.Matrix4)}},ac6a:function(e,i,t){for(var n=t("cadf"),r=t("0d58"),s=t("2aba"),a=t("7726"),o=t("32e9"),u=t("84f2"),l=t("2b4c"),c=l("iterator"),m=l("toStringTag"),C=u.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=r(f),d=0;d<h.length;d++){var p,g=h[d],v=f[g],S=a[g],w=S&&S.prototype;if(w&&(w[c]||o(w,c,C),w[m]||o(w,m,g),u[g]=C,v))for(p in n)w[p]||s(w,p,n[p],!0)}},b679:function(e,i,t){"use strict";t.r(i);var n=function(){var e=this,i=e._self._c;return i("div",{staticStyle:{width:"100%",height:"100%"}},[i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}}),i("div",{staticClass:"btns"},[i("i",{on:{click:e.handleClick}},[e._v("\n      "+e._s(e.cut?"内部裁切":"外部裁切")+"\n    ")])])])},r=[],s=t("904f"),a={data:function(){return{cut:!1,tileset:null}},computed:{},watch:{},mounted:function(){window.$InitMap(),this.tileset=new Cesium.Cesium3DTileset({url:"https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json",debugShowMemoryUsage:!1}),viewer.scene.primitives.add(this.tileset),viewer.zoomTo(this.tileset);var e=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);e.setInputAction((function(e){var i=viewer.camera.pickEllipsoid(e.position,viewer.scene.globe.ellipsoid),t=Cesium.Cartographic.fromCartesian(i,viewer.scene.globe.ellipsoid,new Cesium.Cartographic);Cesium.Math.toDegrees(t.longitude),Cesium.Math.toDegrees(t.latitude)}),Cesium.ScreenSpaceEventType.LEFT_CLICK)},methods:{handleClick:function(){this.cut=!this.cut,this.cut?Object(s["b"])(this.tileset,[[121.49260265519028,31.242117807041236],[121.51355676668399,31.245032122784824],[121.51871163020894,31.232316199923016],[121.50450627122848,31.227712061479057],[121.49406078139155,31.238990131267578]],!0):Object(s["b"])(this.tileset,[[121.49260265519028,31.242117807041236],[121.51355676668399,31.245032122784824],[121.51871163020894,31.232316199923016],[121.50450627122848,31.227712061479057],[121.49406078139155,31.238990131267578]],!1)}}},o=a,u=t("2877"),l=Object(u["a"])(o,n,r,!1,null,null,null);i["default"]=l.exports}}]);