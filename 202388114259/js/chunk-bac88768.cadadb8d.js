(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bac88768"],{"11e9":function(e,t,i){var n=i("52a7"),a=i("4630"),o=i("6821"),r=i("6a99"),s=i("69a8"),l=i("c69a"),d=Object.getOwnPropertyDescriptor;t.f=i("9e1e")?d:function(e,t){if(e=o(e),t=r(t,!0),l)try{return d(e,t)}catch(i){}if(s(e,t))return a(!n.f.call(e,t),e[t])}},1960:function(e,t,i){"use strict";i("4f82")},"4f82":function(e,t,i){},"4fc8":function(e,t,i){e.exports=i.p+"202388114259/img/point.4fe971e2.png"},"53ca":function(e,t,i){"use strict";function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}i.d(t,"a",(function(){return n}))},"5dbc":function(e,t,i){var n=i("d3f4"),a=i("8b97").set;e.exports=function(e,t,i){var o,r=t.constructor;return r!==i&&"function"==typeof r&&(o=r.prototype)!==i.prototype&&n(o)&&a&&a(e,o),e}},"7b71":function(e,t,i){"use strict";i.d(t,"c",(function(){return n})),i.d(t,"a",(function(){return a})),i.d(t,"d",(function(){return o})),i.d(t,"e",(function(){return r})),i.d(t,"b",(function(){return s}));i("2ef0"),i("595b");function n(e,t,i,n){var a=viewer,s=a.scene,l=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),d=o({longitude:e.longitude,latitude:e.latitude,altitude:e.altitude},parseFloat(t+i.yaw)),u=n*Math.cos(i.pitch*Math.PI/180);l=r(l,d,u);var c=n*Math.sin(i.pitch*Math.PI/180),m=s.globe.ellipsoid.cartesianToCartographic(l),p=Cesium.Math.toDegrees(m.latitude),y=Cesium.Math.toDegrees(m.longitude);return l=new Cesium.Cartesian3.fromDegrees(y,p,e.altitude-c),l}function a(e,t){var i=Cesium.Ellipsoid.WGS84.cartesianToCartographic(e),n=Cesium.Math.toDegrees(i.longitude),a=Cesium.Math.toDegrees(i.latitude),o={longitude:parseFloat(parseFloat(n).toFixed(7)),latitude:parseFloat(parseFloat(a).toFixed(7)),altitude:parseFloat(i.height)};return o}function o(e,t){var i=new Cesium.Cartesian3.fromDegrees(parseFloat(e.longitude),parseFloat(e.latitude),parseFloat(e.altitude)),n=new Cesium.Cartesian3.fromDegrees(parseFloat(e.longitude),parseFloat(e.latitude)+1e-4,parseFloat(e.altitude)),a=Cesium.Cartographic.fromCartesian(n);a.height=0;var o=Cesium.Cartographic.toCartesian(a),r=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(o,n,new Cesium.Cartesian3),new Cesium.Cartesian3),s=Cesium.Quaternion.fromAxisAngle(r,Cesium.Math.toRadians(t)),l=Cesium.Matrix3.fromQuaternion(s),d=Cesium.Matrix4.fromRotationTranslation(l),u=Cesium.Cartesian3.subtract(n,i,new Cesium.Cartesian3),c=Cesium.Matrix4.multiplyByPoint(d,u,new Cesium.Cartesian3);return c}function r(e,t,i){var n=Cesium.Cartesian3.normalize(t,new Cesium.Cartesian3),a=Cesium.Cartesian3.multiplyByScalar(n,i,new Cesium.Cartesian3);return Cesium.Cartesian3.add(e,a,new Cesium.Cartesian3)}function s(e,t,i,n){return{longitude:e+n*Math.sin(i*Math.PI/180)*180/(6371229*Math.PI*Math.cos(t*Math.PI/180)),latitude:t+n*Math.cos(i*Math.PI/180)/(6371229*Math.PI/180)}}},"8b97":function(e,t,i){var n=i("d3f4"),a=i("cb7c"),o=function(e,t){if(a(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,n){try{n=i("9b43")(Function.call,i("11e9").f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(a){t=!0}return function(e,i){return o(e,i),t?e.__proto__=i:n(e,i),e}}({},!1):void 0),check:o}},9093:function(e,t,i){var n=i("ce10"),a=i("e11e").concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,a)}},a38e:function(e,t,i){"use strict";i.d(t,"a",(function(){return o}));var n=i("53ca");function a(e,t){if("object"!==Object(n["a"])(e)||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var a=i.call(e,t||"default");if("object"!==Object(n["a"])(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}function o(e){var t=a(e,"string");return"symbol"===Object(n["a"])(t)?t:String(t)}},aa77:function(e,t,i){var n=i("5ca1"),a=i("be13"),o=i("79e5"),r=i("fdef"),s="["+r+"]",l="​",d=RegExp("^"+s+s+"*"),u=RegExp(s+s+"*$"),c=function(e,t,i){var a={},s=o((function(){return!!r[e]()||l[e]()!=l})),d=a[e]=s?t(m):r[e];i&&(a[i]=d),n(n.P+n.F*s,"String",a)},m=c.trim=function(e,t){return e=String(a(e)),1&t&&(e=e.replace(d,"")),2&t&&(e=e.replace(u,"")),e};e.exports=c},bee2:function(e,t,i){"use strict";i.d(t,"a",(function(){return o}));var n=i("a38e");function a(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,Object(n["a"])(a.key),a)}}function o(e,t,i){return t&&a(e.prototype,t),i&&a(e,i),Object.defineProperty(e,"prototype",{writable:!1}),e}},c5f6:function(e,t,i){"use strict";var n=i("7726"),a=i("69a8"),o=i("2d95"),r=i("5dbc"),s=i("6a99"),l=i("79e5"),d=i("9093").f,u=i("11e9").f,c=i("86cc").f,m=i("aa77").trim,p="Number",y=n[p],g=y,v=y.prototype,T=o(i("2aeb")(v))==p,w="trim"in String.prototype,h=function(e){var t=s(e,!1);if("string"==typeof t&&t.length>2){t=w?t.trim():m(t,3);var i,n,a,o=t.charCodeAt(0);if(43===o||45===o){if(i=t.charCodeAt(2),88===i||120===i)return NaN}else if(48===o){switch(t.charCodeAt(1)){case 66:case 98:n=2,a=49;break;case 79:case 111:n=8,a=55;break;default:return+t}for(var r,l=t.slice(2),d=0,u=l.length;d<u;d++)if(r=l.charCodeAt(d),r<48||r>a)return NaN;return parseInt(l,n)}}return+t};if(!y(" 0o1")||!y("0b1")||y("+0x1")){y=function(e){var t=arguments.length<1?0:e,i=this;return i instanceof y&&(T?l((function(){v.valueOf.call(i)})):o(i)!=p)?r(new g(h(t)),i,y):h(t)};for(var f,C=i("9e1e")?d(g):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),I=0;C.length>I;I++)a(g,f=C[I])&&!a(y,f)&&c(y,f,u(g,f));y.prototype=v,v.constructor=y,i("2aba")(n,p,y)}},d08b:function(e){e.exports=JSON.parse('[{"index":1,"latitude":39.2018993,"longitude":117.7425557,"altitude":75.53999999999999,"heading":158,"actionEntityList":[],"action":[]},{"index":2,"latitude":39.1989166,"longitude":117.7440725,"altitude":75.53999999999999,"heading":157.94,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108272,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106883,"yaw":0,"zoom":2}],"action":[]},{"index":3,"latitude":39.1990047,"longitude":117.7239447,"altitude":83.59,"heading":269.86,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108273,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106884,"yaw":0,"zoom":2}],"action":[]},{"index":4,"latitude":39.2017961,"longitude":117.7128514,"altitude":87.57,"heading":287.47,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108274,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106885,"yaw":0,"zoom":2}],"action":[]},{"index":5,"latitude":39.2079413,"longitude":117.7151827,"altitude":66.03,"heading":15.99,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108275,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106886,"yaw":0,"zoom":2}],"action":[]},{"index":6,"latitude":39.212949,"longitude":117.7187478,"altitude":65.96000000000001,"heading":28.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"C%2F7I4Izdf6nj%2Fnrqnipxo75e7Rb3aSk3uBAbqwV8oOgAUktDJnP36tDlhfUwUD7BYb9exvR1Og3dZqEkx1js5ViEETIqGRUO+1REuqo6H0nW6lc%2FQudU874JJ5vOYr1qbmXJ5Slep4oUR60qpWCvZBvmaG+V5g6LNIteyU0BP94=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108276,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106887,"yaw":0,"zoom":2}],"action":[]},{"index":7,"latitude":39.2177713,"longitude":117.72242,"altitude":69.63,"heading":30.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"DeUFFl8o+9HTPokQISvJzsMuU+2i7g5EYfEiv+wZTGe5Ik9w5zEnrSI4sV3kR3gaca9XjMUoCN7sf+Xl32kSSsAEAwynOUJ9iTEvyAJ6UHqIIqtCRCDsJ0ooxOIh2IwvURyevBd3dGVFjPt+vvkfMsHbFyEk6kWfkEBB6LQyYp0=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108277,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":30,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"HxLV18MFdOWc4Rg7+fbZI1jvLjFOUn2itNB8fEKVnERnLJvQzT826DlirzKLvgRYpJgQ729+hZeAAiaNr7+IO0vqNsN3ZaosqRTehLpnGUcKWsFoEnakBFzW6mURHXhzH7f3unQZxQHcgZKlCAl4eLL3UTKj%2Fuw5+JmIgrE7NJA=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108278,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":38.85,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"TygexKXjgBSgDn+hn87fF3B2Y%2FDB6l+VcQssciJ5nUwC+hpFsZy+WibvOqOrHqWtP9U94oPmuMbL8qenmR7ykXLwkpa+Ia3SL9boAWRZpTn3eCxUq4CXnzaP%2F9m595uH5Y9cVDranNvObqr0lJFUsLoD1VpMhWJaSGxJaUbILNU=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108279,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2},{"actionId":null,"actionIndex":1,"actionName":"IMTzYnz82kmejGWODqkmqzYqTGDEGy8Yo6Ke1p%2Flr1mLwjNtHtFQw5NjrDsKFdkX5tb4mqbtW2sJyGVUep8MVyt9gzO905YmArvNcS4GIsTjZ0UTb7ibFeLehczj7c6wgmYgIjix8WGaU%2FW1iQe6HvWFWjydE2Sl9QbsI%2FUO4GI=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108280,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":50.71,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106888,"yaw":0,"zoom":2}],"action":[]},{"index":8,"latitude":39.218312,"longitude":117.7226448,"altitude":59.38,"heading":0,"actionEntityList":[],"action":[]},{"index":9,"latitude":39.218312,"longitude":117.7226448,"altitude":39.38,"heading":160.34,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"GZTQTm%2FpKe4gRnP1FQzNEgL5KKw5H0VnsvigziNNMagdf9evuqDBTI2lrV9HkksBne8ovkjeaFgqTQuhJl9jFnJ4te+v7gffUn5uWEJqFT+IjkLZz3ppAw1xX9YVAQXyvMLApx1mqSR2yb4NDfp8b6ex1%2FupjiS4XukZmAU%2FAlo=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108281,"intervalDistance":0,"intervalTime":0,"newTargetType":1,"pitch":0,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":269753,"targetList":"","targetType":3,"updatedTime":"2022-05-19 09:13:58","wayPointId":106890,"yaw":0,"zoom":7}],"action":[]},{"index":10,"latitude":39.2183092,"longitude":117.7226022,"altitude":34.644999999999996,"heading":151.72,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IvQIVkRI5eeeoiDfCysjRqfKK+L70judygBbNOhdQkqTzyl1PErbVu%2FY4qS0vNW8+yocMiuEF+KX3ay121dYm+d2%2FqJItC2Bjm7lPWPCgEszF4CVVYEXPdSDsjfR43pgirRDnjAPKM++%2FTaoDjJtlH4G5kGFBj3JNeFm1JWlQto=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108282,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270135,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106891,"yaw":0.66,"zoom":4},{"actionId":null,"actionIndex":2,"actionName":"gprbFq3yHn4033xNbHvwgnlWTBprmL0i2N%2Fz9K3mSWIRPVSdhA8Nh+BJVDLa%2FwUT1OJHMkS6wVtkYfpkTeyrEP2uZ1Z%2FeTs0GJAuiWyP6AhqHr2jEk75c4+TavxUVG9%2F1N8oSuJkcNz6htiWw6wVGZGlvy6SDY9xWoQPgjwGOoE=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108283,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270138,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106891,"yaw":-0.67,"zoom":4}],"action":[]},{"index":11,"latitude":39.2183151,"longitude":117.7225886,"altitude":28.39,"heading":151.51,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"VkdT2nrlg815jw6H0PFtNmdS262MqWVXUSOhlrZNT8BpsqNq3TEdEcnNpoJ%2FXuzkUMFNTJE5BW2Hj1WGO0P5N4cXZQamtppdl8KJuYpFedPdHyMwgVZm%2FGJq8DAxTekRzuBG9jp%2F2E8t%2FmiJx840gTYWZMibRw5EdcVqay29QXE=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108284,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.02,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270129,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106892,"yaw":1.16,"zoom":5},{"actionId":null,"actionIndex":2,"actionName":"RdFw6EUEIjiYAWlJYV60pOydP90lEeAoFZ+uUQlaOpJTCy3wJf+GgSlsr13wBlpfuWD8iuxmZhTJZ0t+SSUA+3skT8SmdkxZ7wPJehw%2FjEsyWMGb%2F4KdFALjc1brvT+%2FBP3evXQb6HmIhiA%2FmROksCLDCOTvLdjyVH90E0mHEQM=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108285,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.02,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270132,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106892,"yaw":-1.19,"zoom":5}],"action":[]},{"index":12,"latitude":39.2183098,"longitude":117.7225996,"altitude":22.215,"heading":151.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"EQC0tIDcEgFc0V5LJo2FWxI65Hk+wfFnLciDGqF%2Fylcqzqs13iDFauh1oeyIX6FuG10Dpl+Zz+UI47VdFBJFqMDUMTA8V7uv%2FxeEBgHQZHkZ1WhHUj7jeQ1jHWjXqWYS25d7BWMs1BL1RiN7G+riyc+MwOR3niHAqpG3dVo5UQA=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108286,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270123,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106893,"yaw":1.67,"zoom":5},{"actionId":null,"actionIndex":2,"actionName":"J4nQvuYKb1iDHKTcIJessVPWHjTWj%2Fka4Lu84HMLr9OQJEHrShU91+Or7oSKPrq7lYDIr1XuhVcw3dgArcXKw2zZLz9hqdgDqYPuXTOs9hc%2F3QBHqeVWUJ%2FXGtYvXZLh1CfCdy3GSLou+yZrW9gck5eL507ut8jMsjb4+lGxzfw=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108287,"intervalDistance":0,"intervalTime":0,"newTargetType":4,"pitch":-0.06,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":270126,"targetList":"","targetType":0,"updatedTime":"2022-05-19 09:13:58","wayPointId":106893,"yaw":-1.73,"zoom":4}],"action":[]},{"index":13,"latitude":39.218312,"longitude":117.7226448,"altitude":59.38,"heading":160.34,"actionEntityList":[],"action":[]},{"index":14,"latitude":39.2185685,"longitude":117.7230271,"altitude":69.63,"heading":210.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"I7zCUesLF50B6aScJNAWHrJBP0Zbz5GruBBXh4vavN3tRK3STEWCvxnrju1UPV1FZsVU3RKOhWEqRQCxRoHG3henSz79tG%2FkXvXni0QimM8FdiV9ougiikp7SXdfRCtehLT5wldy2JrbJOEhUVQh+kw4Uh7BuAaaY+D%2Fc9Dx33c=","camAction":1,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108288,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":30,"podType":0,"postTime":1000,"preTime":3,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106895,"yaw":0,"zoom":2}],"action":[]},{"index":15,"latitude":39.212949,"longitude":117.7187478,"altitude":66.59,"heading":210.19,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108289,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106896,"yaw":0,"zoom":2}],"action":[]},{"index":16,"latitude":39.2079413,"longitude":117.7151827,"altitude":65.96000000000001,"heading":208.53,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108290,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106897,"yaw":0,"zoom":2}],"action":[]},{"index":17,"latitude":39.2017961,"longitude":117.7128514,"altitude":66.03,"heading":195.99,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108291,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106898,"yaw":0,"zoom":2}],"action":[]},{"index":18,"latitude":39.2008955,"longitude":117.7163989,"altitude":85.67,"heading":107.62,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108292,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106899,"yaw":0,"zoom":2}],"action":[]},{"index":19,"latitude":39.1990047,"longitude":117.7239447,"altitude":87.57,"heading":107.4,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108293,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106900,"yaw":0,"zoom":2}],"action":[]},{"index":20,"latitude":39.1989166,"longitude":117.7440725,"altitude":81.96,"heading":89.86,"actionEntityList":[{"actionId":null,"actionIndex":1,"actionName":"IMBwSd8OdBsVSVG%2FusoYiAEWNAGVTZ7oqpHfAuAj2+wnUrDiIHqMMJdNZFq9QhWFbTiIjeSGX672bDPYfwTkBMnl7nYxwPpUtI7ecZFyScMvuv3WAgC3bzMrdS5DZ+5388fopj%2FJz%2FlaF7zV5vzGujEslmaaVOcosz84XcVQVyw=","camAction":0,"createdTime":"2022-05-19 09:13:58","deleted":0,"id":108294,"intervalDistance":0,"intervalTime":0,"newTargetType":0,"pitch":45,"podType":0,"postTime":1000,"preTime":1,"roll":0,"targetId":0,"targetList":"","targetType":10,"updatedTime":"2022-05-19 09:13:58","wayPointId":106901,"yaw":0,"zoom":2}],"action":[]},{"index":21,"latitude":39.2018993,"longitude":117.7425557,"altitude":75.53999999999999,"heading":337.94,"actionEntityList":[],"action":[]}]')},d4ec:function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}i.d(t,"a",(function(){return n}))},dd91:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"cesium-container"}},[t("div",{staticClass:"btn_container"},[t("button",{on:{click:e.handlePlayback}},[e._v("预览")]),t("button",{on:{click:e.handlePlay}},[e._v(e._s(e.play?"暂停":"播放")+"\n    ")]),t("button",{on:{click:e.handleRestart}},[e._v("重新开始")]),t("button",{on:{click:function(t){return e.handleSpeed(1)}}},[e._v("加速")]),t("button",{on:{click:function(t){return e.handleSpeed(0)}}},[e._v("减速")]),t("button",{on:{click:e.handleDestory}},[e._v("销毁")])])])},a=[],o=(i("c5f6"),i("d08b")),r=i("7b71"),s=i("d4ec"),l=i("bee2"),d=function(){function e(t){Object(s["a"])(this,e),this.Destory(),this.points=t.points||[],this.model=t.model||{uri:"model/Cesium_Air.glb",scale:1,minimumPixelSize:90},this.moveData=[],this.play=!1,this.conePrimitive=null,this.coneOutLinePrimitive=null,this.End=t.End,this.EventListenerFun=null,this.Init()}return Object(l["a"])(e,[{key:"Init",value:function(){this.MakeMoveData(),this.AddEventListener()}},{key:"MakeMoveData",value:function(){var e=this,t=Date.now();if(this.points&&0!==this.points.length){var i=[];this.points.map((function(e,t){e.pointIndex=t,e.actionEntityList&&e.actionEntityList.length>0?e.actionEntityList.map((function(t,n){var a=JSON.parse(JSON.stringify(e));a.actionEntityList=[e.actionEntityList[n]],i.push([Object.assign({turnTo:!0},a),Object.assign(a)])})):i.push([Object.assign({turnTo:!0},e),Object.assign(e)])}));for(var n=0;n<i.length;n++){var a=i[n],o=i[n+1];a&&o&&(o[0].heading=a[1].heading)}var r=this.concatArrFun(i);r.map((function(i,n){var a=t+1e3*n;e.moveData.push({actionEntityList:i.actionEntityList,longitude:i.longitude,latitude:i.latitude,altitude:i.altitude,heading:i.heading,time:a,JulianDate:Cesium.JulianDate.fromDate(new Date(a)),turnTo:i.turnTo,pointIndex:i.pointIndex})}));for(var s=0;s<this.moveData.length;s++){var l=this.moveData[s],d=this.moveData[s+1];l.turnTo&&l&&d&&(l.startTime=Cesium.JulianDate.fromDate(new Date(l.time)),l.endTime=Cesium.JulianDate.fromDate(new Date(d.time)))}var u=new Date(this.moveData[0].time),c=Cesium.JulianDate.fromDate(u);viewer.clock.startTime=c,viewer.clock.currentTime=c;for(var m=new Cesium.SampledPositionProperty,p=new Cesium.SampledProperty(Cesium.Quaternion),y=0;y<this.moveData.length;y++){var g=this.moveData[y],v=Cesium.JulianDate.fromDate(new Date(g.time)),T=Cesium.Cartesian3.fromDegrees(g.longitude,g.latitude,g.altitude);m.addSample(v,T);var w=new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(Number(g.heading||0)-90),Cesium.Math.toRadians(0),Cesium.Math.toRadians(0)),h=Cesium.Transforms.headingPitchRollQuaternion(T,w);p.addSample(v,h)}var f=m._property._times,C=f[0].clone(),I=f[f.length-1].clone();this.AddTrackEntity(C,I,m,p)}}},{key:"AddTrackEntity",value:function(e,t,i,n){var a=this;viewer.entities.getById("trackEntity")&&viewer.entities.remove(viewer.entities.getById("trackEntity"));var o=viewer.entities.add({id:"trackEntity",availability:new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({start:e,stop:t})]),viewFrom:new Cesium.Cartesian3(150,150,150),position:i,orientation:n,model:a.model,path:{show:!0,leadTime:0,trailTime:60,width:10,resolution:1,material:new Cesium.PolylineGlowMaterialProperty({glowPower:.3,taperPower:.3,color:Cesium.Color.PALEGOLDENROD})}});viewer.trackedEntity=o}},{key:"Speed",value:function(e){viewer&&(1===e?viewer.clockViewModel.multiplier*=2:viewer.clockViewModel.multiplier/=2)}},{key:"Restart",value:function(){this.play=!1,viewer&&viewer.clock&&(viewer.clock.currentTime=viewer.clock.startTime)}},{key:"Play",value:function(){this.play=!0,viewer&&viewer.clock&&(viewer.clock.shouldAnimate=!0)}},{key:"Pause",value:function(){this.play=!1,viewer&&viewer.clock&&(viewer.clock.shouldAnimate=!1)}},{key:"Destory",value:function(){if(viewer){viewer.clockViewModel.multiplier=1,viewer.trackedEntity=null;var e=viewer.entities.getById("trackEntity");e&&viewer.entities.remove(e)}this.Restart(),this.Pause(),this.RemoveEventListener(),this.ClearConePrimitive(),this.points=[],this.moveData=[],this.conePrimitive=null,this.coneOutLinePrimitive=null,this.EventListenerFun=null,this.End&&this.End()}},{key:"RemoveEventListener",value:function(){viewer&&(viewer.clock.onTick.removeEventListener(this.EventListenerFun),this.EventListenerFun=null)}},{key:"AddEventListener",value:function(){var e=this,t=!0;this.RemoveEventListener(),this.EventListenerFun=function(i){if(e.play){for(var n=!1,a=0;a<e.moveData.length;a++){var o=e.moveData[a];if(o.startTime&&o.endTime&&o.startTime.secondsOfDay<i.currentTime.secondsOfDay&&o.endTime.secondsOfDay>i.currentTime.secondsOfDay){t&&(e.ClearConePrimitive(),o.actionEntityList&&o.actionEntityList.length>0&&e.HandleAction(e.moveData[a+1])),n=!0;break}}var r=e.moveData[e.moveData.length-1];if(i.currentTime.secondsOfDay>r.JulianDate.secondsOfDay)return void e.Destory();t=!n}},viewer.clock.onTick.addEventListener(e.EventListenerFun)}},{key:"ClearConePrimitive",value:function(){this.conePrimitive&&this.conePrimitive.destroy(),this.coneOutLinePrimitive&&this.coneOutLinePrimitive.destroy()}},{key:"HandleAction",value:function(e,t){var i=this;e.actionEntityList&&e.actionEntityList.length>0&&e.actionEntityList.map((function(t,n){var a=new Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,e.altitude),o=Object(r["c"])(viewer,{longitude:e.longitude,latitude:e.latitude,altitude:e.altitude},e.heading,{yaw:t.yaw,pitch:t.pitch},50);i.MakeCone(a,o,e,t)}))}},{key:"MakeCone",value:function(e,t){this.ClearConePrimitive();var i=new Cesium.Camera(viewer.scene),n=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(t,e,new Cesium.Cartesian3),new Cesium.Cartesian3);i.position=e,i.direction=n,i.up=Cesium.Cartesian3.clone(viewer.camera.up),i.frustum.fov=Cesium.Math.PI_OVER_THREE,i.frustum.near=.1,i.frustum.far=Cesium.Cartesian3.distance(e,t);var a=new Cesium.Cartesian3,o=new Cesium.Matrix3,r=new Cesium.Quaternion,s=(i.positionWC,i.directionWC),l=i.upWC,d=i.rightWC;d=Cesium.Cartesian3.negate(d,a);var u=o;Cesium.Matrix3.setColumn(u,0,d,u),Cesium.Matrix3.setColumn(u,1,l,u),Cesium.Matrix3.setColumn(u,2,s,u);var c=Cesium.Quaternion.fromRotationMatrix(u,r),m=new Cesium.GeometryInstance({geometry:new Cesium.FrustumGeometry({frustum:i.frustum,origin:e,orientation:c}),id:"conePrimitive",attributes:{color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#ff0").withAlpha(.2)),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.conePrimitive=viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:m,eleaseGeometryInstances:!1,appearance:new Cesium.PerInstanceColorAppearance({flat:!0})}));var p=new Cesium.GeometryInstance({geometry:new Cesium.FrustumOutlineGeometry({frustum:i.frustum,origin:e,orientation:c}),id:"coneOutLinePrimitive",attributes:{color:new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#f00").withAlpha(1)),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.coneOutLinePrimitive=viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:p,eleaseGeometryInstances:!1,appearance:new Cesium.PerInstanceColorAppearance({flat:!0})}))}},{key:"concatArrFun",value:function(e){if(e&&e.length>0){var t=e.reduce((function(e,t){return e.concat(t)}));return t}}}]),e}(),u={data:function(){return{$roaming:null,play:!1}},computed:{},watch:{},mounted:function(){window.$InitMap(),viewer.entities.removeAll(),window.viewer=viewer;var e=[];o.map((function(t,n){var a=Object(r["b"])(t.longitude,t.latitude,t.heading,20);viewer.entities.add(new Cesium.Entity({id:"heading"+n,name:"headingLine",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights([t.longitude,t.latitude,t.altitude,a.longitude,a.latitude,t.altitude]),width:10,material:new Cesium.PolylineArrowMaterialProperty(new Cesium.Color.fromCssColorString("#fff").withAlpha(1)),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2)},show:!0}));t.actionEntityList&&t.actionEntityList.length>0&&t.actionEntityList.map((function(e,i){var a="Action"+n+i,o=40,s=new Cesium.Cartesian3.fromDegrees(t.longitude,t.latitude,t.altitude),l=Object(r["d"])(t,Number(t.heading+e.yaw)),d=o*Math.cos(e.pitch*Math.PI/180);s=Object(r["e"])(s,l,d);var u=o*Math.sin(e.pitch*Math.PI/180),c=viewer.scene.globe.ellipsoid.cartesianToCartographic(s),m=Cesium.Math.toDegrees(c.latitude),p=Cesium.Math.toDegrees(c.longitude);s=new Cesium.Cartesian3.fromDegrees(p,m,t.altitude-u);var y=viewer.entities.add(new Cesium.Entity({id:a,position:s,orientation:Cesium.Transforms.headingPitchRollQuaternion(s,new Cesium.HeadingPitchRoll.fromDegrees(Number(t.heading+e.yaw),0,-1*e.pitch)),box:{dimensions:new Cesium.Cartesian3(.3,2*o,.3),material:new Cesium.PolylineArrowMaterialProperty(new Cesium.Color.fromCssColorString("#fff").withAlpha(1)),outline:!1},show:!0}));return y}));viewer.entities.add(new Cesium.Entity({id:"point"+t.index,name:"point",position:Cesium.Cartesian3.fromDegrees(t.longitude,t.latitude,t.altitude),data:{point:t},billboard:{image:i("4fc8"),verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,scale:.5,scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),show:!0},label:{text:t.index+"",fillColor:new Cesium.Color.fromCssColorString("#fff"),outlineColor:new Cesium.Color.fromCssColorString("#fff"),outlineWidth:.5,verticalOrigin:Cesium.VerticalOrigin.CENTER,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,showBackground:!0,backgroundColor:new Cesium.Color.fromCssColorString("#fff").withAlpha(0),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2),show:!0}}));e.push(t.longitude),e.push(t.latitude),e.push(t.altitude)}));var t=viewer.entities.add(new Cesium.Entity({id:"line",name:"line",polyline:{positions:Cesium.Cartesian3.fromDegreesArrayHeights(e),width:4,arcType:Cesium.ArcType.RHUMB,material:new Cesium.PolylineDashMaterialProperty({color:new Cesium.Color.fromCssColorString("#FCB718").withAlpha(1),dashLength:10}),scaleByDistance:new Cesium.NearFarScalar(100,.6,7e3,.2)}}));viewer.flyTo(t,{duration:1,offset:new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-30),Cesium.Math.toRadians(-45),Cesium.Math.toRadians(0))})},methods:{handleSpeed:function(e){this.$roaming.Speed(e)},handlePlayback:function(){var e=this;this.$roaming=new d({points:o,model:{uri:"model/Cesium_Air.glb",scale:1,minimumPixelSize:90},End:function(){e.play=!1}})},handleDestory:function(){this.$roaming.Destory()},handleRestart:function(){this.$roaming.Restart()},handlePlay:function(){this.play=!this.play,this.play?this.$roaming.Play():this.$roaming.Pause()}}},c=u,m=(i("1960"),i("2877")),p=Object(m["a"])(c,n,a,!1,null,null,null);t["default"]=p.exports},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);