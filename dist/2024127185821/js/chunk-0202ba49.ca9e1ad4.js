(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0202ba49"],{"904f":function(e,t,i){"use strict";i.d(t,"b",(function(){return r})),i.d(t,"a",(function(){return a}));i("ac6a");var n=i("595b");function r(e,t,i){e.readyPromise.then((function(e){for(var n=l(e),r=t,a=s(r,!i),o=[],C=0;C<a.length-1;C++){var c=u(a[C],a[C+1],n);o.push(c)}var m=new Cesium.ClippingPlaneCollection({planes:o,unionClippingRegions:i,edgeWidth:1});e.clippingPlanes=m}))}function a(e,t){var i={url:e,maximumScreenSpaceError:8,clippingPlanes:t},n=viewer.scene.primitives.add(new Cesium.Cesium3DTileset(i));return n.readyPromise.then((function(e){if(!Cesium.Matrix4.equals(e.root.transform,Cesium.Matrix4.IDENTITY)){var i=Cesium.Matrix4.getTranslation(e.root.transform,new Cesium.Cartesian3),n=Cesium.Cartographic.fromCartesian(i),r=Cesium.Cartographic.fromCartesian(e.boundingSphere.center),a=r.height-n.height;return t.modelMatrix=Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0,0,a)),e}})),n}function s(e,t){var i=[];e.forEach((function(e){i.push([e[0],e[1]])}));var r=Object(n["lineString"])(i),a=Object(n["booleanClockwise"])(r),s=[];if(t)if(a)for(var o=0,u=e.length-1;u>=0;u--)s[o]=e[u],o++;else s=e;else if(a)s=e;else for(var l=0,C=e.length-1;C>=0;C--)s[l]=e[C],l++;return s}function o(e,t){var i=Cesium.Cartesian3.fromDegrees(e[0],e[1]);return Cesium.Matrix4.multiplyByPoint(t,i,new Cesium.Cartesian3(0,0,0))}function u(e,t,i){var n=o(e,i),r=o(t,i),a=new Cesium.Cartesian3(0,0,10),s=Cesium.Cartesian3.subtract(r,n,new Cesium.Cartesian3),u=Cesium.Cartesian3.cross(s,a,new Cesium.Cartesian3);u=Cesium.Cartesian3.normalize(u,u);var l=Cesium.Plane.fromPointNormal(n,u);return Cesium.ClippingPlane.fromPlane(l)}function l(e){var t,i=e.root.transform;return t=i&&i.equals(Cesium.Matrix4.IDENTITY)||!i?Cesium.Transforms.eastNorthUpToFixedFrame(e.boundingSphere.center):Cesium.Matrix4.fromArray(e.root.transform),Cesium.Matrix4.inverseTransformation(t,new Cesium.Matrix4)}},ac6a:function(e,t,i){for(var n=i("cadf"),r=i("0d58"),a=i("2aba"),s=i("7726"),o=i("32e9"),u=i("84f2"),l=i("2b4c"),C=l("iterator"),c=l("toStringTag"),m=u.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=r(f),d=0;d<h.length;d++){var g,p=h[d],w=f[p],v=s[p],M=v&&v.prototype;if(M&&(M[C]||o(M,C,m),M[c]||o(M,c,p),u[p]=m,w))for(g in n)M[g]||a(M,g,n[g],!0)}},f126:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"}},[t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}}),t("div",{staticClass:"btns"},[t("i",{on:{click:e.handleClick}},[e._v("\n      "+e._s(e.cut?"内部裁切":"外部裁切")+"\n    ")])])])},r=[],a=(i("96cf"),i("3b8d")),s=i("c31f"),o=i("904f"),u={data:function(){return{cut:!1,tileset:null}},computed:{},watch:{},mounted:function(){function e(e,t){viewer.entities.add(new Cesium.Entity({position:e,point:{color:Cesium.Color.RED,pixelSize:20},label:{text:"".concat(t),pixelOffset:new Cesium.Cartesian2(0,-30),style:Cesium.LabelStyle.FILL_AND_OUTLINE,fillColor:new Cesium.Color.fromCssColorString("#fff"),outlineColor:new Cesium.Color.fromCssColorString("#000"),outlineWidth:1,verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),showBackground:!1}}))}window.$InitMap(),this.tileset=new Cesium.Cesium3DTileset({url:"/model/truck/good/terra_b3dms/tileset.json",debugShowMemoryUsage:!1}),viewer.scene.primitives.add(this.tileset),this.tileset.readyPromise.then(function(){var i=Object(a["a"])(regeneratorRuntime.mark((function i(n){var r,a,o,u,l,C,c,m,f,h,d,g,p,w,v,M,S,b,L,T;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return window.$tileset=n,r=n.boundingSphere,a=r.center,e(a,"中心点"),i.next=6,Cesium.sampleTerrainMostDetailed(viewer.terrainProvider,[a]);case 6:for(o=i.sent,e(o[0],"最高点"),u={},l=100,C=Object(s["i"])(a),c=0;c<10;c++)m=36*c,f=t(C.longitude,C.latitude,m,l),h=Cesium.Cartesian3.fromDegrees(f.longitude,f.latitude,C.altitude),u[m]=f,e(h,c);d=n.root.boundingVolume._orientedBoundingBox.halfAxes,g=new Cesium.Cartesian3,p=new Cesium.Cartesian3,w=new Cesium.Cartesian3,Cesium.Matrix3.getColumn(d,0,g),Cesium.Matrix3.getColumn(d,1,p),Cesium.Matrix3.getColumn(d,2,w),v=new Cesium.Cartesian3,M=new Cesium.Cartesian3,S=new Cesium.Cartesian3,Cesium.Cartesian3.subtract(a,g,v),Cesium.Cartesian3.subtract(v,p,M),Cesium.Cartesian3.subtract(M,w,S),e(v,1),e(M,2),e(S,3),b=new Cesium.Cartesian3,L=new Cesium.Cartesian3,T=new Cesium.Cartesian3,Cesium.Cartesian3.add(a,g,b),Cesium.Cartesian3.add(b,p,L),Cesium.Cartesian3.add(L,w,T),e(b,4),e(L,5),e(T,6);case 37:case"end":return i.stop()}}),i)})));return function(e){return i.apply(this,arguments)}}()).catch((function(e){})),viewer.zoomTo(this.tileset);var t=function(e,t,i,n){function r(e){return e*Math.PI/180}function a(e){return 180*e/Math.PI}var s=6378137,o=6356752.3142,u=1/298.257223563,l=1*e,C=1*t,c=n,m=r(i),f=Math.sin(m),h=Math.cos(m),d=(1-u)*Math.tan(r(C)),g=1/Math.sqrt(1+d*d),p=d*g,w=Math.atan2(d,h),v=g*f,M=1-v*v,S=M*(s*s-o*o)/(o*o),b=1+S/16384*(4096+S*(S*(320-175*S)-768)),L=S/1024*(256+S*(S*(74-47*S)-128)),T=c/(o*b),x=2*Math.PI;while(Math.abs(T-x)>1e-12){var y=Math.cos(2*w+T),P=Math.sin(T),D=Math.cos(T),E=L*P*(y+L/4*(D*(2*y*y-1)-L/6*y*(4*P*P-3)*(4*y*y-3)));x=T,T=c/(o*b)+E}var O=p*P-g*D*h,k=Math.atan2(p*D+g*P*h,(1-u)*Math.sqrt(v*v+O*O)),I=Math.atan2(P*f,g*D-p*P*h),N=u/16*M*(4+u*(4-3*M)),R=I-(1-N)*u*v*(T+N*P*(y+N*D*(2*y*y-1)));return{longitude:l+a(R),latitude:a(k)}},i=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);i.setInputAction((function(e){var t=viewer.camera.pickEllipsoid(e.position,viewer.scene.globe.ellipsoid),i=Cesium.Cartographic.fromCartesian(t,viewer.scene.globe.ellipsoid,new Cesium.Cartographic);Cesium.Math.toDegrees(i.longitude),Cesium.Math.toDegrees(i.latitude)}),Cesium.ScreenSpaceEventType.LEFT_CLICK)},methods:{handleClick:function(){this.cut=!this.cut,this.cut?Object(o["b"])(this.tileset,[[108.95894311437783,34.22035032161717],[108.96006120806729,34.22033432773524],[108.96003202722433,34.21938510624817],[108.95885692316273,34.21942298461592],[108.95894311437783,34.22035032161717]],!0):Object(o["b"])(this.tileset,[[108.95894311437783,34.22035032161717],[108.96006120806729,34.22033432773524],[108.96003202722433,34.21938510624817],[108.95885692316273,34.21942298461592],[108.95894311437783,34.22035032161717]],!1)}}},l=u,C=i("2877"),c=Object(C["a"])(l,n,r,!1,null,null,null);t["default"]=c.exports}}]);