(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-224795fd"],{"11e9":function(e,t,n){var r=n("52a7"),i=n("4630"),o=n("6821"),a=n("6a99"),c=n("69a8"),s=n("c69a"),l=Object.getOwnPropertyDescriptor;t.f=n("9e1e")?l:function(e,t){if(e=o(e),t=a(t,!0),s)try{return l(e,t)}catch(n){}if(c(e,t))return i(!r.f.call(e,t),e[t])}},"2e81":function(e,t,n){"use strict";n("b1e5")},"5dbc":function(e,t,n){var r=n("d3f4"),i=n("8b97").set;e.exports=function(e,t,n){var o,a=t.constructor;return a!==n&&"function"==typeof a&&(o=a.prototype)!==n.prototype&&r(o)&&i&&i(e,o),e}},"8b97":function(e,t,n){var r=n("d3f4"),i=n("cb7c"),o=function(e,t){if(i(e),!r(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,r){try{r=n("9b43")(Function.call,n("11e9").f(Object.prototype,"__proto__").set,2),r(e,[]),t=!(e instanceof Array)}catch(i){t=!0}return function(e,n){return o(e,n),t?e.__proto__=n:r(e,n),e}}({},!1):void 0),check:o}},9093:function(e,t,n){var r=n("ce10"),i=n("e11e").concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,i)}},"95ae":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[n("div",{staticStyle:{position:"absolute",width:"400px",right:"50px",top:"100px","z-index":"9"}},[n("div",[n("el-slider",{attrs:{min:0,max:100},on:{input:e.handleChange},model:{value:e.sliderVal,callback:function(t){e.sliderVal=t},expression:"sliderVal"}})],1)]),n("div",{staticClass:"model_container"},[n("ThreeModel",{ref:"ThreeModelA",staticClass:"three_model",attrs:{id:"three_model_a",url:"model/shengDock.glb",size:20}}),n("ThreeModel",{ref:"ThreeModelB",staticClass:"three_model",attrs:{id:"three_model_b",url:"model/shengfeiji.glb",size:200}}),n("ThreeModel",{ref:"ThreeModelC",staticClass:"three_model",attrs:{id:"three_model_c",url:"model/SnowyVillage.glb",size:5}})],1)])},i=[],o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"three_container",attrs:{id:e.id}})},a=[],c=(n("96cf"),n("1da1")),s=(n("c5f6"),n("5a89")),l=n("4721"),d=n("34ad"),u={name:"ThreeModel",props:{size:{type:Number,default:20},url:{type:String,default:"three_container"},id:{type:String,default:""}},data:function(){return{modelMixer:null,modelClock:null,modelAnimationAction:null,modelAnimationAction2:null,model:null,scene:null,camera:null,renderer:null,textureLoader:null,groupBox:null,control:null,enableRotate:null}},computed:{},watch:{},mounted:function(){window.cancelAnimationFrame(this.clearAnim),this.init()},beforeDestroy:function(){window.cancelAnimationFrame(this.clearAnim)},methods:{applyScalar:function(e){this.model&&this.model.traverse((function(t){t.isMesh&&t.worldDir&&t.position.copy((new s["qb"]).copy(t.userData.oldPs).add((new s["qb"]).copy(t.worldDir).multiplyScalar(e)))}))},init:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){var t,n,r,i,o,a,c,u,m,p,h=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this,n=document.getElementById(this.id),r=n.clientWidth,i=n.clientHeight,this.scene=new s["db"],this.scene.background=null,o=r/i,a=400,this.camera=new s["U"](-a*o,a*o,a,-a,1,1e3),this.camera.position.set(0,180,360),this.camera.lookAt(this.scene.position),this.renderer=new s["sb"]({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),this.renderer.setSize(400,400),this.renderer.shadowMap.enabled=!0,this.textureLoader=new s["mb"],this.groupBox=new s["p"],c=new s["W"](16777215),c.position.set(500,300,400),this.scene.add(c),u=new s["a"](16777215,.8),this.scene.add(u),n.appendChild(this.renderer.domElement),this.control=new l["a"](this.camera,this.renderer.domElement),this.control.enableDamping=!0,this.control.dampingFactor=.5,this.control.enableZoom=!0,this.control.autoRotate=!1,this.control.minDistance=20,this.control.maxDistance=1e3,this.control.enablePan=!0,this.control.maxPolarAngle=1.5,this.control.minPolarAngle=0,this.enableRotate=!0,m=new d["a"],e.next=37,m.load(this.url,(function(e){e.scene.name="Cesium_Air",e.scene.scale.set(t.size,t.size,t.size),e.scene.position.set(0,0,0),e.scene.translateY(0),t.modelMixer=new s["c"](e.scene),t.modelClock=new s["i"],e.animations.length>0&&(t.modelAnimationAction=t.modelMixer.clipAction(e.animations[0]),t.modelAnimationAction.timeScale=1,t.modelAnimationAction.clampWhenFinished=!0),t.scene.add(e.scene),t.model=e.scene;var n=new s["e"],r=new s["e"];n.expandByObject(t.model);var i=(new s["qb"]).addVectors(n.max,n.min).multiplyScalar(.5);t.model.traverse((function(e){if(e.isMesh){r.setFromObject(e);var t=(new s["qb"]).addVectors(r.max,r.min).multiplyScalar(.5);if(isNaN(t.x))return;e.worldDir=(new s["qb"]).subVectors(t,i).normalize(),e.userData.oldPs=e.getWorldPosition(new s["qb"])}}))}),(function(e){}),(function(e){}));case 37:p=function e(){h.clearAnim=requestAnimationFrame(e),h.control.update(),h.renderer.render(h.scene,h.camera),h.modelMixer&&h.modelMixer.update(h.modelClock.getDelta())},p();case 39:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},m=u,p=(n("2e81"),n("2877")),h=Object(p["a"])(m,o,a,!1,null,"4dc64262",null),f=h.exports,g={components:{ThreeModel:f},data:function(){return{sliderVal:0,paused:!1}},computed:{},watch:{},mounted:function(){Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM";var e=new Cesium.Viewer("cesium-container",{terrainProvider:Cesium.createWorldTerrain(),animation:!1,baseLayerPicker:!1,fullscreenButton:!1,vrButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,timeline:!1,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!0,imageryProvider:new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"})});e.camera.flyTo({destination:Cesium.Rectangle.fromDegrees(100,10,120,70)}),e.scene.camera.moveEnd.addEventListener((function(){})),e.camera.percentageChanged=1e-5,e.camera.changed.addEventListener((function(e){}));var t=new Cesium.ScreenSpaceEventHandler(e.scene.canvas);t.setInputAction((function(t){var n=e.camera.pickEllipsoid(t.position,e.scene.globe.ellipsoid),r=Cesium.Cartographic.fromCartesian(n,e.scene.globe.ellipsoid,new Cesium.Cartographic);Cesium.Math.toDegrees(r.longitude),Cesium.Math.toDegrees(r.latitude)}),Cesium.ScreenSpaceEventType.LEFT_CLICK),t.setInputAction((function(e){}),Cesium.ScreenSpaceEventType.MOUSE_MOVE)},methods:{handleChange:function(e){this.$refs.ThreeModelA.applyScalar(e),this.$refs.ThreeModelB.applyScalar(e),this.$refs.ThreeModelC.applyScalar(e)}}},b=g,v=(n("dc70"),Object(p["a"])(b,r,i,!1,null,null,null));t["default"]=v.exports},aa77:function(e,t,n){var r=n("5ca1"),i=n("be13"),o=n("79e5"),a=n("fdef"),c="["+a+"]",s="​",l=RegExp("^"+c+c+"*"),d=RegExp(c+c+"*$"),u=function(e,t,n){var i={},c=o((function(){return!!a[e]()||s[e]()!=s})),l=i[e]=c?t(m):a[e];n&&(i[n]=l),r(r.P+r.F*c,"String",i)},m=u.trim=function(e,t){return e=String(i(e)),1&t&&(e=e.replace(l,"")),2&t&&(e=e.replace(d,"")),e};e.exports=u},b1e5:function(e,t,n){},b203:function(e,t,n){},c5f6:function(e,t,n){"use strict";var r=n("7726"),i=n("69a8"),o=n("2d95"),a=n("5dbc"),c=n("6a99"),s=n("79e5"),l=n("9093").f,d=n("11e9").f,u=n("86cc").f,m=n("aa77").trim,p="Number",h=r[p],f=h,g=h.prototype,b=o(n("2aeb")(g))==p,v="trim"in String.prototype,w=function(e){var t=c(e,!1);if("string"==typeof t&&t.length>2){t=v?t.trim():m(t,3);var n,r,i,o=t.charCodeAt(0);if(43===o||45===o){if(n=t.charCodeAt(2),88===n||120===n)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:r=2,i=49;break;case 79:case 111:r=8,i=55;break;default:return+t}for(var a,s=t.slice(2),l=0,d=s.length;l<d;l++)if(a=s.charCodeAt(l),a<48||a>i)return NaN;return parseInt(s,r)}}return+t};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof h&&(b?s((function(){g.valueOf.call(n)})):o(n)!=p)?a(new f(w(t)),n,h):w(t)};for(var y,C=n("9e1e")?l(f):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),I=0;C.length>I;I++)i(f,y=C[I])&&!i(h,y)&&u(h,y,d(f,y));h.prototype=g,g.constructor=h,n("2aba")(r,p,h)}},dc70:function(e,t,n){"use strict";n("b203")},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);