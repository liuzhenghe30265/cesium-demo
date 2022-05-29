define(["./when-208fe5b0","./Cartesian2-b4b7b0b3","./Transforms-73e77b72","./ComponentDatatype-2da3a966","./Check-5e798bbf","./GeometryAttribute-b541caa6","./GeometryAttributes-b0b294d8","./IndexDatatype-3bc916b1","./Math-8386669c","./WallGeometryLibrary-74769a2f","./RuntimeError-7f634f5d","./WebGLConstants-5e2a49ab","./arrayRemoveDuplicates-3a9a9480","./PolylinePipeline-b7eedbaf","./EllipsoidGeodesic-92f0d3cc","./EllipsoidRhumbLine-73a4e3eb","./IntersectionTests-40db2afa","./Plane-b91bfb59"],function(E,v,C,H,e,A,k,w,G,L,i,t,a,n,r,o,s,l){"use strict";var x=new v.Cartesian3,P=new v.Cartesian3;function d(e){var i=(e=E.defaultValue(e,E.defaultValue.EMPTY_OBJECT)).positions,t=e.maximumHeights,a=e.minimumHeights,n=E.defaultValue(e.granularity,G.CesiumMath.RADIANS_PER_DEGREE),e=E.defaultValue(e.ellipsoid,v.Ellipsoid.WGS84);this._positions=i,this._minimumHeights=a,this._maximumHeights=t,this._granularity=n,this._ellipsoid=v.Ellipsoid.clone(e),this._workerName="createWallOutlineGeometry";i=1+i.length*v.Cartesian3.packedLength+2;E.defined(a)&&(i+=a.length),E.defined(t)&&(i+=t.length),this.packedLength=i+v.Ellipsoid.packedLength+1}d.pack=function(e,i,t){var a;t=E.defaultValue(t,0);var n=e._positions,r=n.length;for(i[t++]=r,a=0;a<r;++a,t+=v.Cartesian3.packedLength)v.Cartesian3.pack(n[a],i,t);var o=e._minimumHeights,r=E.defined(o)?o.length:0;if(i[t++]=r,E.defined(o))for(a=0;a<r;++a)i[t++]=o[a];var s=e._maximumHeights;if(r=E.defined(s)?s.length:0,i[t++]=r,E.defined(s))for(a=0;a<r;++a)i[t++]=s[a];return v.Ellipsoid.pack(e._ellipsoid,i,t),i[t+=v.Ellipsoid.packedLength]=e._granularity,i};var u=v.Ellipsoid.clone(v.Ellipsoid.UNIT_SPHERE),p={positions:void 0,minimumHeights:void 0,maximumHeights:void 0,ellipsoid:u,granularity:void 0};return d.unpack=function(e,i,t){i=E.defaultValue(i,0);for(var a,n,r=e[i++],o=new Array(r),s=0;s<r;++s,i+=v.Cartesian3.packedLength)o[s]=v.Cartesian3.unpack(e,i);if(0<(r=e[i++]))for(a=new Array(r),s=0;s<r;++s)a[s]=e[i++];if(0<(r=e[i++]))for(n=new Array(r),s=0;s<r;++s)n[s]=e[i++];var l=v.Ellipsoid.unpack(e,i,u),m=e[i+=v.Ellipsoid.packedLength];return E.defined(t)?(t._positions=o,t._minimumHeights=a,t._maximumHeights=n,t._ellipsoid=v.Ellipsoid.clone(l,t._ellipsoid),t._granularity=m,t):(p.positions=o,p.minimumHeights=a,p.maximumHeights=n,p.granularity=m,new d(p))},d.fromConstantHeights=function(e){var i=(e=E.defaultValue(e,E.defaultValue.EMPTY_OBJECT)).positions,t=e.minimumHeight,a=e.maximumHeight,n=E.defined(t),r=E.defined(a);if(n||r)for(var o=i.length,s=n?new Array(o):void 0,l=r?new Array(o):void 0,m=0;m<o;++m)n&&(s[m]=t),r&&(l[m]=a);return new d({positions:i,maximumHeights:l,minimumHeights:s,ellipsoid:e.ellipsoid})},d.createGeometry=function(e){var i=e._positions,t=e._minimumHeights,a=e._maximumHeights,n=e._granularity,e=e._ellipsoid,t=L.WallGeometryLibrary.computePositions(e,i,a,t,n,!1);if(E.defined(t)){var r=t.bottomPositions,o=t.topPositions,s=o.length,n=2*s,l=new Float64Array(n),m=0;for(s/=3,c=0;c<s;++c){var d=3*c,u=v.Cartesian3.fromArray(o,d,x),d=v.Cartesian3.fromArray(r,d,P);l[m++]=d.x,l[m++]=d.y,l[m++]=d.z,l[m++]=u.x,l[m++]=u.y,l[m++]=u.z}for(var t=new k.GeometryAttributes({position:new A.GeometryAttribute({componentDatatype:H.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:l})}),p=n/3,f=w.IndexDatatype.createTypedArray(p,n=2*p-4+p),h=0,c=0;c<p-2;c+=2){var g=c,y=c+2,b=v.Cartesian3.fromArray(l,3*g,x),_=v.Cartesian3.fromArray(l,3*y,P);v.Cartesian3.equalsEpsilon(b,_,G.CesiumMath.EPSILON10)||(b=c+3,f[h++]=_=c+1,f[h++]=g,f[h++]=_,f[h++]=b,f[h++]=g,f[h++]=y)}return f[h++]=p-2,f[h++]=p-1,new A.Geometry({attributes:t,indices:f,primitiveType:A.PrimitiveType.LINES,boundingSphere:new C.BoundingSphere.fromVertices(l)})}},function(e,i){return(e=E.defined(i)?d.unpack(e,i):e)._ellipsoid=v.Ellipsoid.clone(e._ellipsoid),d.createGeometry(e)}});