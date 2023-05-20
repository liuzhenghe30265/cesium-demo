class CoordinateSystem {
    static x_pi = 3.14159265358979324 * 3000.0 / 180.0
    static pi = 3.1415926535897932384626 // π
    static a = 6378245.0 // 长半轴
    static ee = 0.00669342162296594323 // 扁率

    // 高斯坐标转经纬度
    static GausstoLogLat(X, Y) {
        const ProjNo = parseInt(X / 1000000) // 查找带号
        const iPI = 3.14159265358979324 / 180.0
        const a = 6378140.0
        const f = 1.0 / 298.257 // 80年西安坐标系参数
        let longitude0 = 117.0 // 中央子午线
        longitude0 = longitude0 * iPI // 中央经线
        const X0 = ProjNo * 1000000 + 500000
        const Y0 = 0
        const xval = X - X0
        const yval = Y - Y0 // 带内大地坐标
        const e2 = 2 * f - f * f
        const e1 = (1.0 - Math.sqrt(1 - e2)) / (1.0 + Math.sqrt(1 - e2))
        const ee = e2 / (1 - e2)
        const M = yval
        const u = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256))
        const fai =
            u +
            ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * u) +
            ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) *
            Math.sin(4 * u) +
            ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * u) +
            ((1097 * e1 * e1 * e1 * e1) / 512) * Math.sin(8 * u)
        const C = ee * Math.cos(fai) * Math.cos(fai)
        const T = Math.tan(fai) * Math.tan(fai)
        const NN = a / Math.sqrt(1.0 - e2 * Math.sin(fai) * Math.sin(fai))
        const R =
            (a * (1 - e2)) /
            Math.sqrt(
                (1 - e2 * Math.sin(fai) * Math.sin(fai)) *
                (1 - e2 * Math.sin(fai) * Math.sin(fai)) *
                (1 - e2 * Math.sin(fai) * Math.sin(fai))
            )
        const D = xval / NN
        const longitude1 =
            longitude0 +
            (D -
                ((1 + 2 * T + C) * D * D * D) / 6 +
                ((5 - 2 * C + 28 * T - 3 * C * C + 8 * ee + 24 * T * T) *
                    D *
                    D *
                    D *
                    D *
                    D) /
                120) /
            Math.cos(fai)
        const latitude1 =
            fai -
            ((NN * Math.tan(fai)) / R) *
            ((D * D) / 2 -
                ((5 + 3 * T + 10 * C - 4 * C * C - 9 * ee) * D * D * D * D) / 24 +
                ((61 + 90 * T + 298 * C + 45 * T * T - 256 * ee - 3 * C * C) *
                    D *
                    D *
                    D *
                    D *
                    D *
                    D) /
                720)
        return [longitude1 / iPI, latitude1 / iPI]
    }

    // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换 / 即谷歌、高德 转 百度
    static gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi)
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi)
        var bd_lng = z * Math.cos(theta) + 0.0065
        var bd_lat = z * Math.sin(theta) + 0.006
        return [bd_lng, bd_lat]
    }

    // 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换 / 即百度转谷歌、高德
    static bd09togcj02(bd_lon, bd_lat) {
        const _x_pi = 3.14159265358979324 * 3000.0 / 180.0
        const x = bd_lon - 0.0065
        const y = bd_lat - 0.006
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * _x_pi)
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * _x_pi)
        const gg_lng = z * Math.cos(theta)
        const gg_lat = z * Math.sin(theta)
        return [gg_lng, gg_lat]
    }

    static wgs84togcj02(lng, lat) {
        let dlat = this.transformlat(lng - 105.0, lat - 35.0)
        let dlng = this.transformlng(lng - 105.0, lat - 35.0)
        const radlat = lat / 180.0 * this.pi
        let magic = Math.sin(radlat)
        magic = 1 - this.ee * magic * magic
        const sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.pi)
        dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.pi)
        const mglat = lat + dlat
        const mglng = lng + dlng
        return [mglng, mglat]
    }

    static gcj02towgs84(lng, lat) {
        // GCJ02(火星坐标系) 转GPS84: param lng: 火星坐标系的经度: param lat: 火星坐标系纬度: return :
        let dlat = this.transformlat(lng - 105.0, lat - 35.0)
        let dlng = this.transformlng(lng - 105.0, lat - 35.0)
        const radlat = lat / 180.0 * this.pi
        let magic = Math.sin(radlat)
        magic = 1 - this.ee * magic * magic
        const sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.pi)
        dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.pi)
        const mglat = lat + dlat
        const mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
    }

    static transformlat(lng, lat) {
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * this.pi) + 20.0 * Math.sin(2.0 * lng * this.pi)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lat * this.pi) + 40.0 * Math.sin(lat / 3.0 * this.pi)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(lat / 12.0 * this.pi) + 320 * Math.sin(lat * this.pi / 30.0)) * 2.0 / 3.0
        return ret
    }

    static transformlng(lng, lat) {
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * this.pi) + 20.0 *
            Math.sin(2.0 * lng * this.pi)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lng * this.pi) + 40.0 *
            Math.sin(lng / 3.0 * this.pi)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(lng / 12.0 * this.pi) + 300.0 *
            Math.sin(lng / 30.0 * this.pi)) * 2.0 / 3.0
        return ret
    }
}
export default CoordinateSystem
