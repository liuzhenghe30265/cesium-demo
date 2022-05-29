const t=new Uint8Array([0]),e=[171,75,84,88,32,50,48,187,13,10,26,10];var n,i,s,a,r,o,l,f;!function(t){t[t.NONE=0]="NONE",t[t.BASISLZ=1]="BASISLZ",t[t.ZSTD=2]="ZSTD",t[t.ZLIB=3]="ZLIB"}(n=n||{}),function(t){t[t.BASICFORMAT=0]="BASICFORMAT"}(i=i||{}),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.ETC1S=163]="ETC1S",t[t.UASTC=166]="UASTC"}(s=s||{}),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.SRGB=1]="SRGB"}(a=a||{}),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.LINEAR=1]="LINEAR",t[t.SRGB=2]="SRGB",t[t.ITU=3]="ITU",t[t.NTSC=4]="NTSC",t[t.SLOG=5]="SLOG",t[t.SLOG2=6]="SLOG2"}(r=r||{}),function(t){t[t.ALPHA_STRAIGHT=0]="ALPHA_STRAIGHT",t[t.ALPHA_PREMULTIPLIED=1]="ALPHA_PREMULTIPLIED"}(o=o||{}),function(t){t[t.RGB=0]="RGB",t[t.RRR=3]="RRR",t[t.GGG=4]="GGG",t[t.AAA=15]="AAA"}(l=l||{}),function(t){t[t.RGB=0]="RGB",t[t.RGBA=3]="RGBA",t[t.RRR=4]="RRR",t[t.RRRG=5]="RRRG"}(f=f||{});class U{constructor(){this.vkFormat=0,this.typeSize=1,this.pixelWidth=0,this.pixelHeight=0,this.pixelDepth=0,this.layerCount=0,this.faceCount=1,this.supercompressionScheme=n.NONE,this.levels=[],this.dataFormatDescriptor=[{vendorId:0,descriptorType:i.BASICFORMAT,versionNumber:2,descriptorBlockSize:40,colorModel:s.UNSPECIFIED,colorPrimaries:a.SRGB,transferFunction:a.SRGB,flags:o.ALPHA_STRAIGHT,texelBlockDimension:{x:4,y:4,z:1,w:1},bytesPlane:[],samples:[]}],this.keyValue={},this.globalData=null}}class c{constructor(t,e,n,i){this._dataView=new DataView(t.buffer,t.byteOffset+e,n),this._littleEndian=i,this._offset=0}_nextUint8(){var t=this._dataView.getUint8(this._offset);return this._offset+=1,t}_nextUint16(){var t=this._dataView.getUint16(this._offset,this._littleEndian);return this._offset+=2,t}_nextUint32(){var t=this._dataView.getUint32(this._offset,this._littleEndian);return this._offset+=4,t}_nextUint64(){var t=this._dataView.getUint32(this._offset,this._littleEndian)+2**32*this._dataView.getUint32(this._offset+4,this._littleEndian);return this._offset+=8,t}_skip(t){return this._offset+=t,this}_scan(t,e=0){var n=this._offset;let i=0;for(;this._dataView.getUint8(this._offset)!==e&&i<t;)i++,this._offset++;return i<t&&this._offset++,new Uint8Array(this._dataView.buffer,this._dataView.byteOffset+n,i)}}function h(t){return"undefined"!=typeof TextEncoder?(new TextEncoder).encode(t):Buffer.from(t)}function _(t){return"undefined"!=typeof TextDecoder?(new TextDecoder).decode(t):Buffer.from(t).toString("utf8")}function g(t){let e=0;for(const n of t)e+=n.byteLength;const n=new Uint8Array(e);let i=0;for(const e of t)n.set(new Uint8Array(e),i),i+=e.byteLength;return n}function p(n){const t=new Uint8Array(n.buffer,n.byteOffset,e.length);if(t[0]!==e[0]||t[1]!==e[1]||t[2]!==e[2]||t[3]!==e[3]||t[4]!==e[4]||t[5]!==e[5]||t[6]!==e[6]||t[7]!==e[7]||t[8]!==e[8]||t[9]!==e[9]||t[10]!==e[10]||t[11]!==e[11])throw new Error("Missing KTX 2.0 identifier.");const i=new U,s=17*Uint32Array.BYTES_PER_ELEMENT,a=new c(n,e.length,s,!0);i.vkFormat=a._nextUint32(),i.typeSize=a._nextUint32(),i.pixelWidth=a._nextUint32(),i.pixelHeight=a._nextUint32(),i.pixelDepth=a._nextUint32(),i.layerCount=a._nextUint32(),i.faceCount=a._nextUint32();var r=a._nextUint32();i.supercompressionScheme=a._nextUint32();const o=a._nextUint32(),l=a._nextUint32(),f=a._nextUint32(),h=a._nextUint32(),g=a._nextUint64(),p=a._nextUint64(),x=new c(n,e.length+s,3*r*8,!0);for(let t=0;t<r;t++)i.levels.push({levelData:new Uint8Array(n.buffer,n.byteOffset+x._nextUint64(),x._nextUint64()),uncompressedByteLength:x._nextUint64()});const u=new c(n,o,l,!0),y={vendorId:u._skip(4)._nextUint16(),descriptorType:u._nextUint16(),versionNumber:u._nextUint16(),descriptorBlockSize:u._nextUint16(),colorModel:u._nextUint8(),colorPrimaries:u._nextUint8(),transferFunction:u._nextUint8(),flags:u._nextUint8(),texelBlockDimension:{x:u._nextUint8()+1,y:u._nextUint8()+1,z:u._nextUint8()+1,w:u._nextUint8()+1},bytesPlane:[u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8()],samples:[]},D=(y.descriptorBlockSize/4-6)/4;for(let t=0;t<D;t++)y.samples[t]={bitOffset:u._nextUint16(),bitLength:u._nextUint8(),channelID:u._nextUint8(),samplePosition:[u._nextUint8(),u._nextUint8(),u._nextUint8(),u._nextUint8()],sampleLower:u._nextUint32(),sampleUpper:u._nextUint32()};i.dataFormatDescriptor.length=0,i.dataFormatDescriptor.push(y);const b=new c(n,f,h,!0);for(;b._offset<h;){const n=b._nextUint32(),e=b._scan(n),t=_(e),s=b._scan(n-e.byteLength);i.keyValue[t]=t.match(/^ktx/i)?_(s):s,b._offset%4&&b._skip(4-b._offset%4)}if(p<=0)return i;const d=new c(n,g,p,!0),S=d._nextUint16(),B=d._nextUint16(),w=d._nextUint32(),A=d._nextUint32(),m=d._nextUint32(),T=d._nextUint32(),L=[];for(let t=0;t<r;t++)L.push({imageFlags:d._nextUint32(),rgbSliceByteOffset:d._nextUint32(),rgbSliceByteLength:d._nextUint32(),alphaSliceByteOffset:d._nextUint32(),alphaSliceByteLength:d._nextUint32()});var I=g+d._offset,R=I+w,E=R+A,v=E+m,I=new Uint8Array(n.buffer,n.byteOffset+I,w),R=new Uint8Array(n.buffer,n.byteOffset+R,A),E=new Uint8Array(n.buffer,n.byteOffset+E,m),v=new Uint8Array(n.buffer,n.byteOffset+v,T);return i.globalData={endpointCount:S,selectorCount:B,imageDescs:L,endpointsData:I,selectorsData:R,tablesData:E,extendedData:v},i}function x(){return(x=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n,i=arguments[e];for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}const u={keepWriter:!1};function y(n,s={}){s=x({},u,s);let a=new ArrayBuffer(0);if(n.globalData){const t=new ArrayBuffer(20+5*n.globalData.imageDescs.length*4),e=new DataView(t);e.setUint16(0,n.globalData.endpointCount,!0),e.setUint16(2,n.globalData.selectorCount,!0),e.setUint32(4,n.globalData.endpointsData.byteLength,!0),e.setUint32(8,n.globalData.selectorsData.byteLength,!0),e.setUint32(12,n.globalData.tablesData.byteLength,!0),e.setUint32(16,n.globalData.extendedData.byteLength,!0);for(let t=0;t<n.globalData.imageDescs.length;t++){const i=n.globalData.imageDescs[t];e.setUint32(20+5*t*4,i.imageFlags,!0),e.setUint32(20+5*t*4+4,i.rgbSliceByteOffset,!0),e.setUint32(20+5*t*4+8,i.rgbSliceByteLength,!0),e.setUint32(20+5*t*4+12,i.alphaSliceByteOffset,!0),e.setUint32(20+5*t*4+16,i.alphaSliceByteLength,!0)}a=g([t,n.globalData.endpointsData,n.globalData.selectorsData,n.globalData.tablesData,n.globalData.extendedData])}const r=[];let o=n.keyValue;s.keepWriter||(o=x({},n.keyValue,{KTXwriter:"KTX-Parse v0.2.1"}));for(const e in o){const n=o[e],i=h(e),B="string"==typeof n?h(n):n,a=i.byteLength+1+B.byteLength+1,l=a%4?4-a%4:0;r.push(g([new Uint32Array([a]),i,t,B,t,new Uint8Array(l).fill(0)]))}const l=g(r),f=new ArrayBuffer(44),U=new DataView(f);if(1!==n.dataFormatDescriptor.length||n.dataFormatDescriptor[0].descriptorType!==i.BASICFORMAT)throw new Error("Only BASICFORMAT Data Format Descriptor output supported.");var c=n.dataFormatDescriptor[0];U.setUint32(0,44,!0),U.setUint16(4,c.vendorId,!0),U.setUint16(6,c.descriptorType,!0),U.setUint16(8,c.versionNumber,!0),U.setUint16(10,c.descriptorBlockSize,!0),U.setUint8(12,c.colorModel),U.setUint8(13,c.colorPrimaries),U.setUint8(14,c.transferFunction),U.setUint8(15,c.flags),U.setUint8(16,c.texelBlockDimension.x-1),U.setUint8(17,c.texelBlockDimension.y-1),U.setUint8(18,c.texelBlockDimension.z-1),U.setUint8(19,c.texelBlockDimension.w-1);for(let t=0;t<8;t++)U.setUint8(20+t,c.bytesPlane[t]);for(let t=0;t<c.samples.length;t++){const e=c.samples[t],n=28+16*t;U.setUint16(n,e.bitOffset,!0),U.setUint8(2+n,e.bitLength),U.setUint8(3+n,e.channelID),U.setUint8(4+n,e.samplePosition[0]),U.setUint8(5+n,e.samplePosition[1]),U.setUint8(6+n,e.samplePosition[2]),U.setUint8(7+n,e.samplePosition[3]),U.setUint32(8+n,e.sampleLower,!0),U.setUint32(12+n,e.sampleUpper,!0)}var _=e.length+68+3*n.levels.length*8,s=_+f.byteLength;let p=s+l.byteLength;p%8&&(p+=8-p%8);const y=[],D=new DataView(new ArrayBuffer(3*n.levels.length*8));let b=p+a.byteLength;for(let t=0;t<n.levels.length;t++){const e=n.levels[t];y.push(e.levelData),D.setBigUint64(24*t+0,BigInt(b),!0),D.setBigUint64(24*t+8,BigInt(e.levelData.byteLength),!0),D.setBigUint64(24*t+16,BigInt(e.uncompressedByteLength),!0),b+=e.levelData.byteLength}const d=new ArrayBuffer(68),S=new DataView(d);return S.setUint32(0,n.vkFormat,!0),S.setUint32(4,n.typeSize,!0),S.setUint32(8,n.pixelWidth,!0),S.setUint32(12,n.pixelHeight,!0),S.setUint32(16,n.pixelDepth,!0),S.setUint32(20,n.layerCount,!0),S.setUint32(24,n.faceCount,!0),S.setUint32(28,n.levels.length,!0),S.setUint32(32,n.supercompressionScheme,!0),S.setUint32(36,_,!0),S.setUint32(40,f.byteLength,!0),S.setUint32(44,s,!0),S.setUint32(48,l.byteLength,!0),S.setBigUint64(52,BigInt(p),!0),S.setBigUint64(60,BigInt(a.byteLength),!0),new Uint8Array(g([new Uint8Array(e).buffer,d,D.buffer,f,l,new ArrayBuffer(p-(s+l.byteLength)),a,...y]))}export{l as KTX2ChannelETC1S,f as KTX2ChannelUASTC,U as KTX2Container,i as KTX2DescriptorType,o as KTX2Flags,s as KTX2Model,a as KTX2Primaries,n as KTX2SupercompressionScheme,r as KTX2Transfer,p as read,y as write};