(function(e){function n(n){for(var c,i,r=n[0],o=n[1],h=n[2],l=0,f=[];l<r.length;l++)i=r[l],Object.prototype.hasOwnProperty.call(u,i)&&u[i]&&f.push(u[i][0]),u[i]=0;for(c in o)Object.prototype.hasOwnProperty.call(o,c)&&(e[c]=o[c]);d&&d(n);while(f.length)f.shift()();return a.push.apply(a,h||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],c=!0,i=1;i<t.length;i++){var r=t[i];0!==u[r]&&(c=!1)}c&&(a.splice(n--,1),e=o(o.s=t[0]))}return e}var c={},i={app:0},u={app:0},a=[];function r(e){return o.p+"2023101618222/js/"+({}[e]||e)+"."+{"chunk-1071e628":"dce93e63","chunk-11b58c8f":"4bcb8c3b","chunk-2d0be333":"9d0f8d01","chunk-4e43cb85":"7e18a588","chunk-2d22cfc4":"847db9f9","chunk-4a712f25":"bd4977f2","chunk-5cd8b7ce":"7c5fab9a","chunk-5d4ddb82":"2e0221d9","chunk-73923166":"fe52302e","chunk-796839b4":"86675580","chunk-524701b6":"1053f243","chunk-39c3e400":"69a7bd67","chunk-80f99c6c":"f5c1b0ea","chunk-411eb39e":"b8944174","chunk-428d5a2e":"259a518a","chunk-6800e320":"04df7781","chunk-743cfcd0":"31a6f455","chunk-de940218":"bf7b4143","chunk-2d20914e":"acd50ba2","chunk-35b233aa":"2c97d9d9","chunk-3cfeb596":"d0d5d6b0","chunk-3d737ef0":"645799e7","chunk-231c864a":"4d9b86a2","chunk-72983374":"7883e923","chunk-491745b4":"04dfb3d1","chunk-4c3b6b09":"e5ed2e5c","chunk-4fc03a3c":"84f33cc2","chunk-6b3eb548":"d7991559","chunk-75629efc":"5ee90b7a","chunk-c500de72":"45009aac","chunk-eff2032e":"189a47b7"}[e]+".js"}function o(n){if(c[n])return c[n].exports;var t=c[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.e=function(e){var n=[],t={"chunk-1071e628":1,"chunk-4a712f25":1,"chunk-5d4ddb82":1,"chunk-796839b4":1,"chunk-39c3e400":1,"chunk-80f99c6c":1,"chunk-743cfcd0":1,"chunk-de940218":1,"chunk-35b233aa":1,"chunk-231c864a":1,"chunk-72983374":1,"chunk-491745b4":1,"chunk-4c3b6b09":1,"chunk-4fc03a3c":1,"chunk-eff2032e":1};i[e]?n.push(i[e]):0!==i[e]&&t[e]&&n.push(i[e]=new Promise((function(n,t){for(var c="2023101618222/css/"+({}[e]||e)+"."+{"chunk-1071e628":"f4766274","chunk-11b58c8f":"31d6cfe0","chunk-2d0be333":"31d6cfe0","chunk-4e43cb85":"31d6cfe0","chunk-2d22cfc4":"31d6cfe0","chunk-4a712f25":"22b8e3ae","chunk-5cd8b7ce":"31d6cfe0","chunk-5d4ddb82":"e9f4dab3","chunk-73923166":"31d6cfe0","chunk-796839b4":"488efaa5","chunk-524701b6":"31d6cfe0","chunk-39c3e400":"e841280f","chunk-80f99c6c":"e841280f","chunk-411eb39e":"31d6cfe0","chunk-428d5a2e":"31d6cfe0","chunk-6800e320":"31d6cfe0","chunk-743cfcd0":"e841280f","chunk-de940218":"24214d2c","chunk-2d20914e":"31d6cfe0","chunk-35b233aa":"0ce8b98c","chunk-3cfeb596":"31d6cfe0","chunk-3d737ef0":"31d6cfe0","chunk-231c864a":"8cb7419e","chunk-72983374":"4e396c3c","chunk-491745b4":"371daba0","chunk-4c3b6b09":"e841280f","chunk-4fc03a3c":"c39aabd4","chunk-6b3eb548":"31d6cfe0","chunk-75629efc":"31d6cfe0","chunk-c500de72":"31d6cfe0","chunk-eff2032e":"c49ec01c"}[e]+".css",u=o.p+c,a=document.getElementsByTagName("link"),r=0;r<a.length;r++){var h=a[r],l=h.getAttribute("data-href")||h.getAttribute("href");if("stylesheet"===h.rel&&(l===c||l===u))return n()}var f=document.getElementsByTagName("style");for(r=0;r<f.length;r++){h=f[r],l=h.getAttribute("data-href");if(l===c||l===u)return n()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=n,d.onerror=function(n){var c=n&&n.target&&n.target.src||u,a=new Error("Loading CSS chunk "+e+" failed.\n("+c+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=c,delete i[e],d.parentNode.removeChild(d),t(a)},d.href=u;var s=document.getElementsByTagName("head")[0];s.appendChild(d)})).then((function(){i[e]=0})));var c=u[e];if(0!==c)if(c)n.push(c[2]);else{var a=new Promise((function(n,t){c=u[e]=[n,t]}));n.push(c[2]=a);var h,l=document.createElement("script");l.charset="utf-8",l.timeout=120,o.nc&&l.setAttribute("nonce",o.nc),l.src=r(e);var f=new Error;h=function(n){l.onerror=l.onload=null,clearTimeout(d);var t=u[e];if(0!==t){if(t){var c=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;f.message="Loading chunk "+e+" failed.\n("+c+": "+i+")",f.name="ChunkLoadError",f.type=c,f.request=i,t[1](f)}u[e]=void 0}};var d=setTimeout((function(){h({type:"timeout",target:l})}),12e4);l.onerror=l.onload=h,document.head.appendChild(l)}return Promise.all(n)},o.m=e,o.c=c,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var c in e)o.d(t,c,function(n){return e[n]}.bind(null,c));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o.oe=function(e){throw e};var h=window["webpackJsonp"]=window["webpackJsonp"]||[],l=h.push.bind(h);h.push=n,h=h.slice();for(var f=0;f<h.length;f++)n(h[f]);var d=l;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"56d7":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var c=t("2b0e"),i=(t("7f7f"),function(){var e=this,n=e._self._c;return n("div",{staticStyle:{width:"100%",height:"100%",position:"relative"},attrs:{id:"app"}},[e.navVisible?n("ul",{staticClass:"nav"},e._l(e.visibleRouters,(function(t,c){return n("li",{key:c},[n("router-link",{attrs:{to:t.path}},[e._v("\n        "+e._s(t.name)+"\n      ")])],1)})),0):e._e(),n("a",{staticStyle:{position:"fixed",left:"0",top:"0","z-index":"999",color:"#fff"},attrs:{href:"https://lab.earthsdk.com/model/",target:"blank"}},[e._v("\n    无法加载 tileset ？\n  ")]),n("router-view")],1)}),u=[],a=(t("28a5"),t("386d"),t("8c4f"));c["default"].use(a["a"]);var r=[{path:"/",name:"初始化",visible:!0,component:function(e){return t.e("chunk-2d20914e").then(function(){var n=[t("a812")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Entity",name:"实体",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-2d22cfc4")]).then(function(){var n=[t("f620")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/WallMaterial",name:"动态光墙效果",visible:!0,component:function(e){return t.e("chunk-c500de72").then(function(){var n=[t("3bdc")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/FloodAnalysis",name:"淹没分析",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-411eb39e")]).then(function(){var n=[t("af22")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/DOM",name:"DOM",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-de940218")]).then(function(){var n=[t("5358")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/3DTileset",name:"3DTileset加载",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-73923166")]).then(function(){var n=[t("f126")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/3DTilesetCompare",name:"3DTilesetCompare",visible:!0,component:function(e){return t.e("chunk-1071e628").then(function(){var n=[t("527f")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/3DTilesetClippingPlane",name:"3DTileset切割",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-6800e320")]).then(function(){var n=[t("3b18")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/WMS",name:"WMS",visible:!0,component:function(e){return t.e("chunk-491745b4").then(function(){var n=[t("9732")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/WMS/Query",name:"WMS Query",visible:!0,component:function(e){return t.e("chunk-3cfeb596").then(function(){var n=[t("3091")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Plot",name:"标绘",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-796839b4")]).then(function(){var n=[t("8a6f")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive",name:"Primitive",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-743cfcd0")]).then(function(){var n=[t("6490")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive/Route",name:"Primitive 航线",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-4a712f25")]).then(function(){var n=[t("3b3f")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive/Plot",name:"Primitive Plot",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-5cd8b7ce")]).then(function(){var n=[t("c72b")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive/get",name:"Primitive 拾取",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-524701b6"),t.e("chunk-39c3e400")]).then(function(){var n=[t("f8ef")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive/PrimitiveCollection",name:"PrimitiveCollection",visible:!0,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-524701b6"),t.e("chunk-80f99c6c")]).then(function(){var n=[t("381f")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Primitive/Model",name:"PrimitiveModel",visible:!0,component:function(e){return t.e("chunk-4c3b6b09").then(function(){var n=[t("9e19")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/FirePoint",name:"着火点",visible:!0,component:function(e){return t.e("chunk-6b3eb548").then(function(){var n=[t("c6ec")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Video",name:"Video",visible:!1,component:function(e){return t.e("chunk-35b233aa").then(function(){var n=[t("4aa1")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Path",name:"轨迹",visible:!1,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-428d5a2e")]).then(function(){var n=[t("cc92")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/EarthSdk",name:"EarthSdk",visible:!1,component:function(e){return t.e("chunk-4fc03a3c").then(function(){var n=[t("01b9")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/ThreeJS",name:"ThreeJS",visible:!0,component:function(e){return Promise.all([t.e("chunk-3d737ef0"),t.e("chunk-72983374")]).then(function(){var n=[t("af46")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/ThreeJSBoom",name:"Three炸裂",visible:!0,component:function(e){return Promise.all([t.e("chunk-3d737ef0"),t.e("chunk-231c864a")]).then(function(){var n=[t("95ae")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Playback",name:"轨迹播放",visible:!1,component:function(e){return Promise.all([t.e("chunk-11b58c8f"),t.e("chunk-2d0be333"),t.e("chunk-4e43cb85"),t.e("chunk-5d4ddb82")]).then(function(){var n=[t("dd91")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/Playback2",name:"轨迹播放2",visible:!1,component:function(e){return t.e("chunk-75629efc").then(function(){var n=[t("9ec7")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/WebControl",name:"WebControl",visible:!1,component:function(e){return t.e("chunk-eff2032e").then(function(){var n=[t("8295")];e.apply(null,n)}.bind(this)).catch(t.oe)}}],o=new a["a"]({routes:r}),h=o,l={data:function(){return{lockDate:[],markDate:[],mask:!0,date:"2022-06-01"}},computed:{navVisible:function(){return this.getQueryVariable("nav")||"dev"===this.currentMode},currentMode:function(){return"prod"},visibleRouters:function(){return h.options.routes.filter((function(e){return e.visible}))}},watch:{},mounted:function(){},methods:{getQueryVariable:function(e){for(var n=window.location.search.substring(1),t=n.split("&"),c=0;c<t.length;c++){var i=t[c].split("=");if(i[0]===e)return i[1]}return!1},handleInput:function(e,n){},handleChange:function(e,n){}}},f=l,d=(t("5a5b"),t("2877")),s=Object(d["a"])(f,i,u,!1,null,null,null),b=s.exports,p=t("2f62");c["default"].use(p["a"]);var k=new p["a"].Store({state:{},mutations:{},actions:{},modules:{}}),m=t("28bd"),v=t("5c96"),y=t.n(v),g=(t("0fae"),t("9f22")),P=t.n(g);t("8f8d");function w(){var e=Cesium.Rectangle.fromDegrees(100,10,120,70);Cesium.Camera.DEFAULT_VIEW_RECTANGLE=e,Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM";var n=new Cesium.Viewer("cesium-container",{terrainProvider:Cesium.createWorldTerrain(),animation:!1,baseLayerPicker:!0,fullscreenButton:!0,vrButton:!0,geocoder:!0,homeButton:!0,infoBox:!1,sceneModePicker:!0,selectionIndicator:!1,timeline:!0,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!0,imageryProvider:new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"}),contextOptions:{allowTextureFilterAnisotropic:!1,webgl:{alpha:!0},requestWebgl1:!0}});window.viewer=n}if(c["default"].use(m["a"]),c["default"].use(y.a),c["default"].use(P.a),window.$InitMap=w,"undefined"!==typeof XE){var C=function(){new c["default"]({render:function(e){return e(b)},router:h,store:k}).$mount("#app")};XE.ready().then(C)}else"undefined"!==typeof Cesium&&new c["default"]({render:function(e){return e(b)},router:h,store:k}).$mount("#app")},"5a5b":function(e,n,t){"use strict";t("770e")},"770e":function(e,n,t){}});