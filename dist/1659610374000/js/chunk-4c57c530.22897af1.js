(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4c57c530"],{"209c":function(t,e,n){"use strict";n("3b52")},"3b52":function(t,e,n){},"7cd5":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[n("div",{staticClass:"btns_container"},[n("div",{staticClass:"pub_btn",on:{click:function(e){return t.handleMeasureEarth("POINT")}}},[t._v("\n      位置测量\n    ")]),n("div",{staticClass:"pub_btn",on:{click:function(e){return t.handleMeasureEarth("SPACE_DISTANCE")}}},[t._v("\n      距离测量\n    ")]),n("div",{staticClass:"pub_btn",on:{click:function(e){return t.handleMeasureEarth("SPACE_AREA")}}},[t._v("\n      面积测量\n    ")]),n("div",{staticClass:"pub_btn",on:{click:function(e){return t.handleMeasureEarth("clear")}}},[t._v("\n      清除\n    ")]),n("div",{staticClass:"pub_btn",on:{click:function(e){return t.handleMeasureEarth("SPACE_VOLUME")}}},[t._v("\n      体积测量\n    ")]),n("div",{staticClass:"pub_button_li",staticStyle:{"margin-top":"5px"}},[!t.startShow&&t.computing?n("div",[n("button",{staticClass:"xbsj-button pub_btn",on:{click:t.buttonClick}},[t._v("\n          "+t._s(t.buttonText)+"\n        ")]),n("br"),n("span",[t._v("计算进度:"+t._s((100*t.progress).toFixed(1))+"%")])]):t._e(),t.startShow||t.computing?t._e():n("div",{staticStyle:{width:"218px","border-right":"1px solid",float:"left","margin-right":"14px"}},[n("button",{staticClass:"xbsj-button pub_btn",on:{click:t.buttonClick}},[t._v("\n          "+t._s(t.buttonText)+"\n        ")]),n("br"),n("span",[t._v("计算结果:")]),n("br"),n("span",[t._v("采样间距:"+t._s(t.results.gridWidth.toFixed(2))+"\n          m")]),n("br"),n("span",[t._v("总面积:"+t._s(t.results.area.toFixed(2))+"\n          ㎡")]),n("br"),n("span",[t._v("挖方:"+t._s(t.results.cut.toFixed(2))+"\n          m³")]),n("br"),n("span",[t._v("填方:"+t._s(t.results.fill.toFixed(2))+"\n          m³")]),n("br"),n("span",[t._v("挖填方:"+t._s(t.results.total.toFixed(2))+"\n          m³")]),n("br")]),n("div",{staticStyle:{width:"252px",float:"left"}},[n("span",{staticStyle:{"vertical-align":"middle"}},[t._v("采样间距:")]),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.gridWidth,expression:"gridWidth",modifiers:{number:!0}}],staticClass:"gridWidth",class:t.computing?"notInput":"",domProps:{value:t.gridWidth},on:{input:function(e){e.target.composing||(t.gridWidth=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}}),t._v("\n        m\n        "),n("br"),n("span",{staticStyle:{"vertical-align":"middle"}},[t._v("基准面高程:")]),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.height,expression:"height",modifiers:{number:!0}}],staticClass:"gridWidth",class:t.computing?"notInput":"",domProps:{value:t.height},on:{input:function(e){e.target.composing||(t.height=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}}),t._v("\n        m\n        "),n("br"),n("button",{staticClass:"xbsj-button pub_btn",attrs:{disabled:t.computing},on:{click:t.startClick}},[t._v("\n          开始分析\n        ")])])])])])},s=[],r={data:function(){return{text:{cancelComputing:"取消计算",start:"开始分析",reStart:"重新开始"},startShow:!0,polygonCreating:!1,enabled:!1,status:"",progress:0,computing:!1,gridWidth:1,height:0,results:{gridWidth:0,area:0,cut:0,fill:0,total:0}}},computed:{buttonText:function(){return this.computing?this.text.cancelComputing:this.text.reStart}},watch:{},mounted:function(){var t=new XE.Earth(document.getElementById("cesium-container"),{terrainExaggeration:1,geocoder:!1,sceneModePicker:!1,baseLayerPicker:!1,navigationHelpButton:!1,animation:!1,infoBox:!1,timeline:!1,shouldAnimate:!0,homeButton:!0,fullscreenButton:!0,requestRenderMode:!0,scene3DOnly:!0,useBrowserRecommendedResolution:!1,selectionIndicator:!1,useDefaultRenderLoop:!0,orderIndependentTranslucency:!1,contextOptions:{allowTextureFilterAnisotropic:!1,webgl:{alpha:!0}}});window.earth=t;var e=t.czm.viewer;e.scene3DOnly=!0,window.viewer=e,t.sceneTree.root={children:[{czmObject:{name:"默认离线影像",xbsjType:"Imagery",xbsjImageryProvider:{XbsjImageryProvider:{url:"https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",srcCoordType:"WGS84",dstCoordType:"WGS84",maximumLevel:16}}}}]};var n=new Cesium.Cesium3DTileset({url:"http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",debugShowMemoryUsage:!1});e.scene.primitives.add(n),e.zoomTo(n)},methods:{startClick:function(){2!==this._cutFillComputing.positions.length&&(this._cutFillComputing.compute(),this.startShow=!1)},buttonClick:function(){var t=this;this._cutFillComputing.clearResults(),this._cutFillComputing.polygonCreating=!1,this._cutFillComputing.positions=[],this.$nextTick((function(){t._cutFillComputing.polygonCreating=!0,t.startShow=!0}))},handleMeasureEarth:function(t){var e=this;if("clear"!==t){if("SPACE_VOLUME"===t){this._cutFillComputing=earth.analyzation.cutFillComputing,this._disposers=[];var n=["polygonCreating","progress","computing","gridWidth","height","results.gridWidth","results.area","results.cut","results.fill","results.total"];return n.forEach((function(t){e._disposers.push(XE.MVVM.bind(e,t,e._cutFillComputing,t))})),void(this._cutFillComputing.polygonCreating=!0)}earth.analyzation.measurement.type=t}else earth.analyzation.measurement.clearResults()}}},a=r,o=(n("209c"),n("2877")),u=Object(o["a"])(a,i,s,!1,null,null,null);e["default"]=u.exports}}]);