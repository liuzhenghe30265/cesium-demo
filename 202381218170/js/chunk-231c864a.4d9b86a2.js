(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-231c864a"],{"11e9":function(e,t,n){var r=n("52a7"),i=n("4630"),o=n("6821"),a=n("6a99"),c=n("69a8"),l=n("c69a"),s=Object.getOwnPropertyDescriptor;t.f=n("9e1e")?s:function(e,t){if(e=o(e),t=a(t,!0),l)try{return s(e,t)}catch(n){}if(c(e,t))return i(!r.f.call(e,t),e[t])}},"2b32":function(e,t,n){},"5dbc":function(e,t,n){var r=n("d3f4"),i=n("8b97").set;e.exports=function(e,t,n){var o,a=t.constructor;return a!==n&&"function"==typeof a&&(o=a.prototype)!==n.prototype&&r(o)&&i&&i(e,o),e}},"8b97":function(e,t,n){var r=n("d3f4"),i=n("cb7c"),o=function(e,t){if(i(e),!r(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,r){try{r=n("9b43")(Function.call,n("11e9").f(Object.prototype,"__proto__").set,2),r(e,[]),t=!(e instanceof Array)}catch(i){t=!0}return function(e,n){return o(e,n),t?e.__proto__=n:r(e,n),e}}({},!1):void 0),check:o}},9093:function(e,t,n){var r=n("ce10"),i=n("e11e").concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,i)}},"95ae":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[t("div",{staticStyle:{position:"absolute",width:"400px",right:"50px",top:"100px","z-index":"9"}},[t("div",[t("el-slider",{attrs:{min:0,max:100},on:{input:e.handleChange},model:{value:e.sliderVal,callback:function(t){e.sliderVal=t},expression:"sliderVal"}})],1)]),t("div",{staticClass:"model_container"},[t("ThreeModel",{ref:"ThreeModelA",staticClass:"three_model",attrs:{id:"three_model_a",url:"model/SnowyVillage.glb",size:5}})],1)])},i=[],o=function(){var e=this,t=e._self._c;return t("div",{staticClass:"three_container",attrs:{id:e.id}})},a=[],c=(n("96cf"),n("1da1")),l=(n("c5f6"),n("5a89")),s=n("4721"),u=n("34ad"),d={name:"ThreeModel",props:{size:{type:Number,default:20},url:{type:String,default:"three_container"},id:{type:String,default:""}},data:function(){return{modelMixer:null,modelClock:null,modelAnimationAction:null,modelAnimationAction2:null,model:null,scene:null,camera:null,renderer:null,textureLoader:null,groupBox:null,control:null,enableRotate:null}},computed:{},watch:{},mounted:function(){window.cancelAnimationFrame(this.clearAnim),this.init()},beforeDestroy:function(){window.cancelAnimationFrame(this.clearAnim)},methods:{applyScalar:function(e){this.model&&this.model.traverse((function(t){t.isMesh&&t.worldDir&&t.position.copy((new l["pb"]).copy(t.userData.oldPs).add((new l["pb"]).copy(t.worldDir).multiplyScalar(e)))}))},init:function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){var t,n,r,i,o,a,c,d,p,f,h=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this,n=document.getElementById(this.id),r=n.clientWidth,i=n.clientHeight,this.scene=new l["cb"],this.scene.background=null,o=r/i,a=400,this.camera=new l["T"](-a*o,a*o,a,-a,1,1e3),this.camera.position.set(0,180,360),this.camera.lookAt(this.scene.position),this.renderer=new l["rb"]({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),this.renderer.setSize(800,800),this.renderer.shadowMap.enabled=!0,this.textureLoader=new l["lb"],this.groupBox=new l["p"],c=new l["V"](16777215),c.position.set(500,300,400),this.scene.add(c),d=new l["a"](16777215,.8),this.scene.add(d),n.appendChild(this.renderer.domElement),this.control=new s["a"](this.camera,this.renderer.domElement),this.control.enableDamping=!0,this.control.dampingFactor=.5,this.control.enableZoom=!0,this.control.autoRotate=!1,this.control.minDistance=20,this.control.maxDistance=1e3,this.control.enablePan=!0,this.control.maxPolarAngle=1.5,this.control.minPolarAngle=0,this.enableRotate=!0,p=new u["a"],e.next=37,p.load(this.url,(function(e){e.scene.name="Cesium_Air",e.scene.scale.set(t.size,t.size,t.size),e.scene.position.set(0,0,0),e.scene.translateY(0),t.modelMixer=new l["c"](e.scene),t.modelClock=new l["i"],e.animations.length>0&&(t.modelAnimationAction=t.modelMixer.clipAction(e.animations[0]),t.modelAnimationAction.timeScale=1,t.modelAnimationAction.clampWhenFinished=!0),t.scene.add(e.scene),t.model=e.scene;var n=new l["e"],r=new l["e"];n.expandByObject(t.model);var i=(new l["pb"]).addVectors(n.max,n.min).multiplyScalar(.5);t.model.traverse((function(e){if(e.isMesh){r.setFromObject(e);var t=(new l["pb"]).addVectors(r.max,r.min).multiplyScalar(.5);if(isNaN(t.x))return;e.worldDir=(new l["pb"]).subVectors(t,i).normalize(),e.userData.oldPs=e.getWorldPosition(new l["pb"])}}))}),(function(e){}),(function(e){}));case 37:f=function e(){h.clearAnim=requestAnimationFrame(e),h.control.update(),h.renderer.render(h.scene,h.camera),h.modelMixer&&h.modelMixer.update(h.modelClock.getDelta())},f();case 39:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},p=d,f=n("2877"),h=Object(f["a"])(p,o,a,!1,null,null,null),m=h.exports,b={components:{ThreeModel:m},data:function(){return{sliderVal:0,paused:!1}},computed:{},watch:{},mounted:function(){window.$InitMap()},methods:{handleChange:function(e){this.$refs.ThreeModelA.applyScalar(e)}}},w=b,g=(n("df84"),Object(f["a"])(w,r,i,!1,null,null,null));t["default"]=g.exports},aa77:function(e,t,n){var r=n("5ca1"),i=n("be13"),o=n("79e5"),a=n("fdef"),c="["+a+"]",l="​",s=RegExp("^"+c+c+"*"),u=RegExp(c+c+"*$"),d=function(e,t,n){var i={},c=o((function(){return!!a[e]()||l[e]()!=l})),s=i[e]=c?t(p):a[e];n&&(i[n]=s),r(r.P+r.F*c,"String",i)},p=d.trim=function(e,t){return e=String(i(e)),1&t&&(e=e.replace(s,"")),2&t&&(e=e.replace(u,"")),e};e.exports=d},c5f6:function(e,t,n){"use strict";var r=n("7726"),i=n("69a8"),o=n("2d95"),a=n("5dbc"),c=n("6a99"),l=n("79e5"),s=n("9093").f,u=n("11e9").f,d=n("86cc").f,p=n("aa77").trim,f="Number",h=r[f],m=h,b=h.prototype,w=o(n("2aeb")(b))==f,g="trim"in String.prototype,y=function(e){var t=c(e,!1);if("string"==typeof t&&t.length>2){t=g?t.trim():p(t,3);var n,r,i,o=t.charCodeAt(0);if(43===o||45===o){if(n=t.charCodeAt(2),88===n||120===n)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:r=2,i=49;break;case 79:case 111:r=8,i=55;break;default:return+t}for(var a,l=t.slice(2),s=0,u=l.length;s<u;s++)if(a=l.charCodeAt(s),a<48||a>i)return NaN;return parseInt(l,r)}}return+t};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof h&&(w?l((function(){b.valueOf.call(n)})):o(n)!=f)?a(new m(y(t)),n,h):y(t)};for(var A,v=n("9e1e")?s(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;v.length>x;x++)i(m,A=v[x])&&!i(h,A)&&d(h,A,u(m,A));h.prototype=b,b.constructor=h,n("2aba")(r,f,h)}},df84:function(e,t,n){"use strict";n("2b32")},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);