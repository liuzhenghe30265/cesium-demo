(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e78cd140"],{"11e9":function(e,t,i){var n=i("52a7"),a=i("4630"),o=i("6821"),r=i("6a99"),s=i("69a8"),l=i("c69a"),d=Object.getOwnPropertyDescriptor;t.f=i("9e1e")?d:function(e,t){if(e=o(e),t=r(t,!0),l)try{return d(e,t)}catch(i){}if(s(e,t))return a(!n.f.call(e,t),e[t])}},"454f":function(e,t,i){i("46a7");var n=i("584a").Object;e.exports=function(e,t,i){return n.defineProperty(e,t,i)}},"46a7":function(e,t,i){var n=i("63b6");n(n.S+n.F*!i("8e60"),"Object",{defineProperty:i("d9f6").f})},"4fc8":function(e,t,i){e.exports=i.p+"202211210615/img/point.4fe971e2.png"},"5b5e":function(e,t,i){"use strict";i("cb7ce")},"5dbc":function(e,t,i){var n=i("d3f4"),a=i("8b97").set;e.exports=function(e,t,i){var o,r=t.constructor;return r!==i&&"function"==typeof r&&(o=r.prototype)!==i.prototype&&n(o)&&a&&a(e,o),e}},"7b71":function(e,t,i){"use strict";i("c5f6");function n(e,t,i,n,a){e.camera;var o=e.scene,r=new Cesium.Cartesian3.fromDegrees(t.longitude,t.latitude,t.altitude),d=s({longitude:t.longitude,latitude:t.latitude,altitude:t.altitude},Number(i+n.yaw)),c=a*Math.cos(n.pitch*Math.PI/180);r=l(r,d,c);var u=a*Math.sin(n.pitch*Math.PI/180),m=o.globe.ellipsoid.cartesianToCartographic(r),p=Cesium.Math.toDegrees(m.latitude),g=Cesium.Math.toDegrees(m.longitude);return r=new Cesium.Cartesian3.fromDegrees(g,p,t.altitude-u),r}function a(e){var t=Cesium.Ellipsoid.WGS84.cartesianToCartographic(e),i=Cesium.Math.toDegrees(t.longitude),n=Cesium.Math.toDegrees(t.latitude),a={longitude:Number(parseFloat(i).toFixed(7)),latitude:Number(parseFloat(n).toFixed(7)),altitude:Number(parseFloat(t.height))};return a}function o(e){var t=e.camera.computeViewRectangle(),i={};if("undefined"===typeof t){var n=function(e,t,i){var n=e.camera,a=e.scene,o=new Cesium.Cartesian2(t,i),r=a.globe.ellipsoid,s=n.pickEllipsoid(o,r),l=a.globe.ellipsoid.cartesianToCartographic(s),d=Cesium.Math.toDegrees(l.longitude),c=Cesium.Math.toDegrees(l.latitude);return{lon:d,lat:c}},a=e.scene.canvas,o=n(e,0,0),r=n(e,a.clientWidth,a.clientHeight);i.xmin=o.lon,i.xmax=r.lon,i.ymin=o.lat,i.ymax=r.lat}else i.xmax=Cesium.Math.toDegrees(t.east),i.ymax=Cesium.Math.toDegrees(t.north),i.xmin=Cesium.Math.toDegrees(t.west),i.ymin=Cesium.Math.toDegrees(t.south);return i}function r(e,t,i,n){return{longitude:e+n*Math.sin(i*Math.PI/180)*180/(6371229*Math.PI*Math.cos(t*Math.PI/180)),latitude:t+n*Math.cos(i*Math.PI/180)/(6371229*Math.PI/180)}}function s(e,t){var i=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),n=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude+1e-4,e.altitude),a=Cesium.Cartographic.fromCartesian(n);a.height=0;var o=Cesium.Cartographic.toCartesian(a),r=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(o,n,new Cesium.Cartesian3),new Cesium.Cartesian3),s=Cesium.Quaternion.fromAxisAngle(r,Cesium.Math.toRadians(t)),l=Cesium.Matrix3.fromQuaternion(s),d=Cesium.Matrix4.fromRotationTranslation(l),c=Cesium.Cartesian3.subtract(n,i,new Cesium.Cartesian3),u=Cesium.Matrix4.multiplyByPoint(d,c,new Cesium.Cartesian3);return u}function l(e,t,i){var n=Cesium.Cartesian3.normalize(t,new Cesium.Cartesian3),a=Cesium.Cartesian3.multiplyByScalar(n,i,new Cesium.Cartesian3);return Cesium.Cartesian3.add(e,a,new Cesium.Cartesian3)}t["a"]={getEndPointByYawPitch:n,cartesianToLongAndLat:a,getExtend:o,translateByDirection:l,getVector:s,distancePos:r}},"85f2":function(e,t,i){e.exports=i("454f")},"8b97":function(e,t,i){var n=i("d3f4"),a=i("cb7c"),o=function(e,t){if(a(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,n){try{n=i("9b43")(Function.call,i("11e9").f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(a){t=!0}return function(e,i){return o(e,i),t?e.__proto__=i:n(e,i),e}}({},!1):void 0),check:o}},9093:function(e,t,i){var n=i("ce10"),a=i("e11e").concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,a)}},a2e8:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[t("div",{staticClass:"btn_container"},[t("button",{on:{click:e.handlePlayback}},[e._v("预览")]),t("button",{on:{click:e.handlePlay}},[e._v(e._s(e.play?"暂停":"播放")+"\n    ")]),t("button",{on:{click:e.handleRestart}},[e._v("重新开始")]),t("button",{on:{click:function(t){return e.handleSpeed(1)}}},[e._v("加速")]),t("button",{on:{click:function(t){return e.handleSpeed(0)}}},[e._v("减速")]),t("button",{on:{click:e.handleDestory}},[e._v("销毁")])])])},a=[],o=(i("c5f6"),i("f932")),r=i("7b71"),s=i("d225"),l=i("b0b4"),d=function(){function e(t,i){Object(s["a"])(this,e),this.Destory(),this.viewer=t,this.points=i.points||[],this.model=i.model||{uri:"model/Cesium_Air.glb",scale:1,minimumPixelSize:90},this.moveData=[],this.play=!1,this.conePrimitive=null,this.coneOutLinePrimitive=null,this.End=i.End,this.EventListenerFun=null,this.Init()}return Object(l["a"])(e,[{key:"Init",value:function(){this.MakeMoveData(),this.AddEventListener()}},{key:"MakeMoveData",value:function(){var e=this,t=Date.now(),i=this.viewer;if(this.points&&0!==this.points.length){var n=[];this.points.map((function(e,t){e.pointIndex=t,e.actionEntityList&&e.actionEntityList.length>0?e.actionEntityList.map((function(t,i){var a=JSON.parse(JSON.stringify(e));a.actionEntityList=[e.actionEntityList[i]],n.push([Object.assign({turnTo:!0},a),Object.assign(a)])})):n.push([Object.assign({turnTo:!0},e),Object.assign(e)])}));for(var a=0;a<n.length;a++){var o=n[a],r=n[a+1];o&&r&&(r[0].heading=o[1].heading)}var s=this.concatArrFun(n);s.map((function(i,n){var a=t+1e3*n;e.moveData.push({actionEntityList:i.actionEntityList,longitude:i.longitude,latitude:i.latitude,altitude:i.altitude,heading:i.heading,time:a,JulianDate:Cesium.JulianDate.fromDate(new Date(a)),turnTo:i.turnTo,pointIndex:i.pointIndex})}));for(var l=0;l<this.moveData.length;l++){var d=this.moveData[l],c=this.moveData[l+1];d.turnTo&&d&&c&&(d.startTime=Cesium.JulianDate.fromDate(new Date(d.time)),d.endTime=Cesium.JulianDate.fromDate(new Date(c.time)))}var u=new Date(this.moveData[0].time),m=Cesium.JulianDate.fromDate(u);i.clock.startTime=m,i.clock.currentTime=m;for(var p=new Cesium.SampledPositionProperty,g=new Cesium.SampledProperty(Cesium.Quaternion),h=0;h<this.moveData.length;h++){var y=this.moveData[h],T=Cesium.JulianDate.fromDate(new Date(y.time)),v=Cesium.Cartesian3.fromDegrees(y.longitude,y.latitude,y.altitude);p.addSample(T,v);var w=new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(Number(y.heading||0)-90),Cesium.Math.toRadians(0),Cesium.Math.toRadians(0)),f=Cesium.Transforms.headingPitchRollQuaternion(v,w);g.addSample(T,f)}var C=p._property._times,I=C[0].clone(),E=C[C.length-1].clone();this.AddTrackEntity(I,E,p,g)}}},{key:"AddTrackEntity",value:function(e,t,i,n){var a=this;this.viewer.entities.getById("trackEntity")&&this.viewer.entities.remove(this.viewer.entities.getById("trackEntity"));var o=this.viewer.entities.add({id:"trackEntity",availability:new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({start:e,stop:t})]),viewFrom:new Cesium.Cartesian3(150,150,150),position:i,orientation:n,model:a.model,path:{show:!0,leadTime:0,trailTime:60,width:10,resolution:1,material:new Cesium.PolylineGlowMaterialProperty({glowPower:.3,taperPower:.3,color:Cesium.Color.PALEGOLDENROD})}});this.viewer.trackedEntity=o}},{key:"Speed",value:function(e){this.viewer&&(1===e?this.viewer.clockViewModel.multiplier*=2:this.viewer.clockViewModel.multiplier/=2)}},{key:"Restart",value:function(){this.play=!1,this.viewer&&this.viewer.clock&&(this.viewer.clock.currentTime=this.viewer.clock.startTime)}},{key:"Play",value:function(){this.play=!0,this.viewer&&this.viewer.clock&&(this.viewer.clock.shouldAnimate=!0)}},{key:"Pause",value:function(){this.play=!1,this.viewer&&this.viewer.clock&&(this.viewer.clock.shouldAnimate=!1)}},{key:"Destory",value:function(){if(this.viewer){this.viewer.clockViewModel.multiplier=1,this.viewer.trackedEntity=null;var e=this.viewer.entities.getById("trackEntity");e&&this.viewer.entities.remove(e)}this.Restart(),this.Pause(),this.RemoveEventListener(),this.viewer=null,this.points=[],this.moveData=[],this.conePrimitive=null,this.coneOutLinePrimitive=null,this.EventListenerFun=null}},{key:"RemoveEventListener",value:function(){this.viewer&&(this.viewer.clock.onTick.removeEventListener(this.EventListenerFun),this.EventListenerFun=null)}},{key:"AddEventListener",value:function(){var e=this,t=!0;this.RemoveEventListener(),this.EventListenerFun=function(i){if(e.play){for(var n=!1,a=0;a<e.moveData.length;a++){var o=e.moveData[a];if(o.startTime&&o.endTime&&o.startTime.secondsOfDay<i.currentTime.secondsOfDay&&o.endTime.secondsOfDay>i.currentTime.secondsOfDay){t&&(e.ClearConePrimitive(),o.actionEntityList&&o.actionEntityList.length>0&&e.HandleAction(e.moveData[a+1])),n=!0;break}}var r=e.moveData[e.moveData.length-1];if(i.currentTime.secondsOfDay>r.JulianDate.secondsOfDay)return e.ClearConePrimitive(),e.End(),void e.Destory();t=!n}},e.viewer.clock.onTick.addEventListener(e.EventListenerFun)}},{key:"ClearConePrimitive",value:function(){this.conePrimitive&&this.conePrimitive.destroy(),this.coneOutLinePrimitive&&this.coneOutLinePrimitive.destroy()}},{key:"HandleAction",value:function(e,t){var i=this;e.actionEntityList&&e.actionEntityList.length>0&&e.actionEntityList.map((function(t,n){var a=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),o=r["a"].getEndPointByYawPitch(i.viewer,{longitude:e.longitude,latitude:e.latitude,altitude:e.altitude},e.heading,{yaw:t.yaw,pitch:t.pitch},50);i.MakeCone(a,o,e,t)}))}},{key:"MakeCone",value:function(e,t){this.ClearConePrimitive();var i=new Cesium.Camera(this.viewer.scene),n=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(t,e,new Cesium.Cartesian3),new Cesium.Cartesian3);i.position=e,i.direction=n,i.up=Cesium.Cartesian3.clone(this.viewer.camera.up),i.frustum.fov=Cesium.Math.PI_OVER_THREE,i.frustum.near=.1,i.frustum.far=Cesium.Cartesian3.distance(e,t);var a=new Cesium.Cartesian3,o=new Cesium.Matrix3,r=new Cesium.Quaternion,s=(i.positionWC,i.directionWC),l=i.upWC,d=i.rightWC;d=Cesium.Cartesian3.negate(d,a);var c=o;Cesium.Matrix3.setColumn(c,0,d,c),Cesium.Matrix3.setColumn(c,1,l,c),Cesium.Matrix3.setColumn(c,2,s,c);var u=Cesium.Quaternion.fromRotationMatrix(c,r),m=new Cesium.GeometryInstance({geometry:new Cesium.FrustumGeometry({frustum:i.frustum,origin:e,orientation:u}),id:"conePrimitive",attributes:{color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#ff0").withAlpha(.2)),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.conePrimitive=this.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:m,eleaseGeometryInstances:!1,appearance:new Cesium.PerInstanceColorAppearance({flat:!0})}));var p=new Cesium.GeometryInstance({geometry:new Cesium.FrustumOutlineGeometry({frustum:i.frustum,origin:e,orientation:u}),id:"coneOutLinePrimitive",attributes:{color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#f00").withAlpha(1)),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.coneOutLinePrimitive=this.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:p,eleaseGeometryInstances:!1,appearance:new Cesium.PerInstanceColorAppearance({flat:!0})}))}},{key:"concatArrFun",value:function(e){if(e&&e.length>0){var t=e.reduce((function(e,t){return e.concat(t)}));return t}}}]),e}(),c={data:function(){return{$roaming:null,play:!1,viewer:null}},computed:{},watch:{},mounted:function(){var e=this;Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM",this.viewer=new Cesium.Viewer("cesium-container",{terrainProvider:Cesium.createWorldTerrain(),animation:!1,timeline:!1,baseLayerPicker:!1,fullscreenButton:!1,vrButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!0,imageryProvider:new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"})}),this.viewer.entities.removeAll();var t=[];o.map((function(n,a){var o=r["a"].distancePos(n.longitude,n.latitude,n.heading,20);e.viewer.entities.add(new Cesium.Entity({id:"heading"+a,name:"headingLine",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights([n.longitude,n.latitude,n.altitude,o.longitude,o.latitude,n.altitude]),width:10,material:new Cesium.PolylineArrowMaterialProperty(new Cesium.Color.fromCssColorString("#fff").withAlpha(1)),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2)},show:!0}));n.actionEntityList&&n.actionEntityList.length>0&&n.actionEntityList.map((function(t,i){var o="Action"+a+i,s=40,l=new Cesium.Cartesian3.fromDegrees(n.longitude,n.latitude,n.altitude),d=r["a"].getVector(n,Number(n.heading+t.yaw)),c=s*Math.cos(t.pitch*Math.PI/180);l=r["a"].translateByDirection(l,d,c);var u=s*Math.sin(t.pitch*Math.PI/180),m=e.viewer.scene.globe.ellipsoid.cartesianToCartographic(l),p=Cesium.Math.toDegrees(m.latitude),g=Cesium.Math.toDegrees(m.longitude);l=new Cesium.Cartesian3.fromDegrees(g,p,n.altitude-u);var h=e.viewer.entities.add(new Cesium.Entity({id:o,position:l,orientation:Cesium.Transforms.headingPitchRollQuaternion(l,new Cesium.HeadingPitchRoll.fromDegrees(Number(n.heading+t.yaw),0,-1*t.pitch)),box:{dimensions:new Cesium.Cartesian3(.3,2*s,.3),material:new Cesium.PolylineArrowMaterialProperty(new Cesium.Color.fromCssColorString("#fff").withAlpha(1)),outline:!1},show:!0}));return h}));e.viewer.entities.add(new Cesium.Entity({id:"point"+n.index,name:"point",position:Cesium.Cartesian3.fromDegrees(n.longitude,n.latitude,n.altitude),data:{point:n},billboard:{image:i("4fc8"),verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,scale:.5,scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),show:!0},label:{text:n.index+"",fillColor:new Cesium.Color.fromCssColorString("#fff"),outlineColor:new Cesium.Color.fromCssColorString("#fff"),outlineWidth:.5,verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,showBackground:!0,backgroundColor:new Cesium.Color.fromCssColorString("#fff").withAlpha(0),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),show:!0}}));t.push(n.longitude),t.push(n.latitude),t.push(n.altitude)}));var n=this.viewer.entities.add(new Cesium.Entity({id:"line",name:"line",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights(t),width:4,arcType:Cesium.ArcType.RHUMB,material:new Cesium.PolylineDashMaterialProperty({color:new Cesium.Color.fromCssColorString("#FCB718").withAlpha(1),dashLength:10}),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2)}}));this.viewer.flyTo(n,{duration:1,offset:new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-30),Cesium.Math.toRadians(-45),Cesium.Math.toRadians(0))})},methods:{handleSpeed:function(e){this.$roaming.Speed(e)},handlePlayback:function(){var e=this;this.$roaming=new d(this.viewer,{points:o,model:{uri:"model/Cesium_Air.glb",scale:1,minimumPixelSize:90},End:function(){e.play=!1}})},handleDestory:function(){this.$roaming.Destory()},handleRestart:function(){this.$roaming.Restart()},handlePlay:function(){this.play=!this.play,this.play?this.$roaming.Play():this.$roaming.Pause()}}},u=c,m=(i("5b5e"),i("2877")),p=Object(m["a"])(u,n,a,!1,null,null,null);t["default"]=p.exports},aa77:function(e,t,i){var n=i("5ca1"),a=i("be13"),o=i("79e5"),r=i("fdef"),s="["+r+"]",l="​",d=RegExp("^"+s+s+"*"),c=RegExp(s+s+"*$"),u=function(e,t,i){var a={},s=o((function(){return!!r[e]()||l[e]()!=l})),d=a[e]=s?t(m):r[e];i&&(a[i]=d),n(n.P+n.F*s,"String",a)},m=u.trim=function(e,t){return e=String(a(e)),1&t&&(e=e.replace(d,"")),2&t&&(e=e.replace(c,"")),e};e.exports=u},b0b4:function(e,t,i){"use strict";i.d(t,"a",(function(){return r}));var n=i("85f2"),a=i.n(n);function o(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),a()(e,n.key,n)}}function r(e,t,i){return t&&o(e.prototype,t),i&&o(e,i),a()(e,"prototype",{writable:!1}),e}},c5f6:function(e,t,i){"use strict";var n=i("7726"),a=i("69a8"),o=i("2d95"),r=i("5dbc"),s=i("6a99"),l=i("79e5"),d=i("9093").f,c=i("11e9").f,u=i("86cc").f,m=i("aa77").trim,p="Number",g=n[p],h=g,y=g.prototype,T=o(i("2aeb")(y))==p,v="trim"in String.prototype,w=function(e){var t=s(e,!1);if("string"==typeof t&&t.length>2){t=v?t.trim():m(t,3);var i,n,a,o=t.charCodeAt(0);if(43===o||45===o){if(i=t.charCodeAt(2),88===i||120===i)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:n=2,a=49;break;case 79:case 111:n=8,a=55;break;default:return+t}for(var r,l=t.slice(2),d=0,c=l.length;d<c;d++)if(r=l.charCodeAt(d),r<48||r>a)return NaN;return parseInt(l,n)}}return+t};if(!g(" 0o1")||!g("0b1")||g("+0x1")){g=function(e){var t=arguments.length<1?0:e,i=this;return i instanceof g&&(T?l((function(){y.valueOf.call(i)})):o(i)!=p)?r(new h(w(t)),i,g):w(t)};for(var f,C=i("9e1e")?d(h):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),I=0;C.length>I;I++)a(h,f=C[I])&&!a(g,f)&&u(g,f,c(h,f));g.prototype=y,y.constructor=g,i("2aba")(n,p,g)}},cb7ce:function(e,t,i){},d225:function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}i.d(t,"a",(function(){return n}))},f932:function(e){e.exports=JSON.parse('[{"index":1,"latitude":39.2018993,"longitude":117.7425557,"altitude":75.53999999999999,"heading":158,"actionEntityList":[],"action":[]},{"index":2,"latitude":39.1989166,"longitude":117.7440725,"altitude":75.53999999999999,"heading":157.94,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108272,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106883,"yaw":0,"zoom":2}],"action":[]},{"index":3,"latitude":39.1990047,"longitude":117.7239447,"altitude":83.59,"heading":269.86,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108273,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106884,"yaw":0,"zoom":2}],"action":[]},{"index":4,"latitude":39.2017961,"longitude":117.7128514,"altitude":87.57,"heading":287.47,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108274,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106885,"yaw":0,"zoom":2}],"action":[]},{"index":5,"latitude":39.2079413,"longitude":117.7151827,"altitude":66.03,"heading":15.99,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108275,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106886,"yaw":0,"zoom":2}],"action":[]},{"index":6,"latitude":39.212949,"longitude":117.7187478,"altitude":65.96000000000001,"heading":28.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108276,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106887,"yaw":0,"zoom":2}],"action":[]},{"index":7,"latitude":39.2177713,"longitude":117.72242,"altitude":69.63,"heading":30.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"DeUFFl8o+9HTPokQISvJzsMuU+2i7g5EYfEiv+wZTGe5Ik9w5zEnrSI4sV3kR3gaca9XjMUoCN7sf+Xl32kSSsAEAwynOUJ9iTEvyAJ6UHqIIqtCRCDsJ0ooxOIh2IwvURyevBd3dGVFjPt+vvkfMsHbFyEk6kWfkEBB6LQyYp0=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108277,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":30,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"HxLV18MFdOWc4Rg7+fbZI1jvLjFOUn2itNB8fEKVnERnLJvQzT826DlirzKLvgRYpJgQ729+hZeAAiaNr7+IO0vqNsN3ZaosqRTehLpnGUcKWsFoEnakBFzW6mURHXhzH7f3unQZxQHcgZKlCAl4eLL3UTKj%2Fuw5+JmIgrE7NJA=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108278,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":38.85,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"TygexKXjgBSgDn+hn87fF3B2Y%2FDB6l+VcQssciJ5nUwC+hpFsZy+WibvOqOrHqWtP9U94oPmuMbL8qenmR7ykXLwkpa+Ia3SL9boAWRZpTn3eCxUq4CXnzaP%2F9m595uH5Y9cVDranNvObqr0lJFUsLoD1VpMhWJaSGxJaUbILNU=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108279,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"IMTzYnz82kmejGWODqkmqzYqTGDEGy8Yo6Ke1p%2Flr1mLwjNtHtFQw5NjrDsKFdkX5tb4mqbtW2sJyGVUep8MVyt9gzO905YmArvNcS4GIsTjZ0UTb7ibFeLehczj7c6wgmYgIjix8WGaU%2FW1iQe6HvWFWjydE2Sl9QbsI%2FUO4GI=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108280,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":50.71,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2}],"action":[]},{"index":8,"latitude":39.218312,"longitude":117.7226448,"altitude":59.38,"heading":0,"actionEntityList":[],"action":[]},{"index":9,"latitude":39.218312,"longitude":117.7226448,"altitude":39.38,"heading":160.34,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"GZTQTm%2FpKe4gRnP1FQzNEgL5KKw5H0VnsvigziNNMagdf9evuqDBTI2lrV9HkksBne8ovkjeaFgqTQuhJl9jFnJ4te+v7gffUn5uWEJqFT+IjkLZz3ppAw1xX9YVAQXyvMLApx1mqSR2yb4NDfp8b6ex1%2FupjiS4XukZmAU%2FAlo=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108281,"intervalDistance":0,"intervalTime":0,"newTargetType":1,"pitch":0,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":269753,"targetList":"","targetType":3,"updatedTime":"2022-05-19 09:13:58","wayPointId":106890,"yaw":0,"zoom":7}],"action":[]},{"index":10,"latitude":39.2183092,"longitude":117.7226022,"altitude":34.644999999999996,"heading":151.72,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IvQIVkRI5eeeoiDfCysjRqfKK+L70judygBbNOhdQkqTzyl1PErbVu%2FY4qS0vNW8+yocMiuEF+KX3ay121dYm+d2%2FqJItC2Bjm7lPWPCgEszF4CVVYEXPdSDsjfR43pgirRDnjAPKM++%2FTaoDjJtlH4G5kGFBj3JNeFm1JWlQto=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108282,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270135,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106891,"yaw":0.66,"zoom":4},{"actionId":null,"actionIndex":2,"actionName":"gprbFq3yHn4033xNbHvwgnlWTBprmL0i2N%2Fz9K3mSWIRPVSdhA8Nh+BJVDLa%2FwUT1OJHMkS6wVtkYfpkTeyrEP2uZ1Z%2FeTs0GJAuiWyP6AhqHr2jEk75c4+TavxUVG9%2F1N8oSuJkcNz6htiWw6wVGZGlvy6SDY9xWoQPgjwGOoE=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108283,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270138,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106891,"yaw":-0.67,"zoom":4}],"action":[]},{"index":11,"latitude":39.2183151,"longitude":117.7225886,"altitude":28.39,"heading":151.51,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"VkdT2nrlg815jw6H0PFtNmdS262MqWVXUSOhlrZNT8BpsqNq3TEdEcnNpoJ%2FXuzkUMFNTJE5BW2Hj1WGO0P5N4cXZQamtppdl8KJuYpFedPdHyMwgVZm%2FGJq8DAxTekRzuBG9jp%2F2E8t%2FmiJx840gTYWZMibRw5EdcVqay29QXE=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108284,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.02,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270129,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106892,"yaw":1.16,"zoom":5},{"actionId":null,"actionIndex":2,"actionName":"RdFw6EUEIjiYAWlJYV60pOydP90lEeAoFZ+uUQlaOpJTCy3wJf+GgSlsr13wBlpfuWD8iuxmZhTJZ0t+SSUA+3skT8SmdkxZ7wPJehw%2FjEsyWMGb%2F4KdFALjc1brvT+%2FBP3evXQb6HmIhiA%2FmROksCLDCOTvLdjyVH90E0mHEQM=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108285,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.02,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270132,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106892,"yaw":-1.19,"zoom":5}],"action":[]},{"index":12,"latitude":39.2183098,"longitude":117.7225996,"altitude":22.215,"heading":151.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"EQC0tIDcEgFc0V5LJo2FWxI65Hk+wfFnLciDGqF%2Fylcqzqs13iDFauh1oeyIX6FuG10Dpl+Zz+UI47VdFBJFqMDUMTA8V7uv%2FxeEBgHQZHkZ1WhHUj7jeQ1jHWjXqWYS25d7BWMs1BL1RiN7G+riyc+MwOR3niHAqpG3dVo5UQA=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108286,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270123,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106893,"yaw":1.67,"zoom":5},{"actionId":null,"actionIndex":2,"actionName":"J4nQvuYKb1iDHKTcIJessVPWHjTWj%2Fka4Lu84HMLr9OQJEHrShU91+Or7oSKPrq7lYDIr1XuhVcw3dgArcXKw2zZLz9hqdgDqYPuXTOs9hc%2F3QBHqeVWUJ%2FXGtYvXZLh1CfCdy3GSLou+yZrW9gck5eL507ut8jMsjb4+lGxzfw=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108287,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270126,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106893,"yaw":-1.73,"zoom":4}],"action":[]},{"index":13,"latitude":39.218312,"longitude":117.7226448,"altitude":59.38,"heading":160.34,"actionEntityList":[],"action":[]},{"index":14,"latitude":39.2185685,"longitude":117.7230271,"altitude":69.63,"heading":210.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"I7zCUesLF50B6aScJNAWHrJBP0Zbz5GruBBXh4vavN3tRK3STEWCvxnrju1UPV1FZsVU3RKOhWEqRQCxRoHG3henSz79tG%2FkXvXni0QimM8FdiV9ougiikp7SXdfRCtehLT5wldy2JrbJOEhUVQh+kw4Uh7BuAaaY+D%2Fc9Dx33c=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108288,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":30,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106895,"yaw":0,"zoom":2}],"action":[]},{"index":15,"latitude":39.212949,"longitude":117.7187478,"altitude":66.59,"heading":210.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108289,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106896,"yaw":0,"zoom":2}],"action":[]},{"index":16,"latitude":39.2079413,"longitude":117.7151827,"altitude":65.96000000000001,"heading":208.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108290,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106897,"yaw":0,"zoom":2}],"action":[]},{"index":17,"latitude":39.2017961,"longitude":117.7128514,"altitude":66.03,"heading":195.99,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108291,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106898,"yaw":0,"zoom":2}],"action":[]},{"index":18,"latitude":39.2008955,"longitude":117.7163989,"altitude":85.67,"heading":107.62,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108292,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106899,"yaw":0,"zoom":2}],"action":[]},{"index":19,"latitude":39.1990047,"longitude":117.7239447,"altitude":87.57,"heading":107.4,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108293,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106900,"yaw":0,"zoom":2}],"action":[]},{"index":20,"latitude":39.1989166,"longitude":117.7440725,"altitude":81.96,"heading":89.86,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108294,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106901,"yaw":0,"zoom":2}],"action":[]},{"index":21,"latitude":39.2018993,"longitude":117.7425557,"altitude":75.53999999999999,"heading":337.94,"actionEntityList":[],"action":[]}]')},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);