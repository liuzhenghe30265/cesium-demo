// GIS 测量

/**
 * @description: 测量（使用 EarthSDK）
 * @param {String} type
 * @return {*}
 */
export function measurementEarth(type) {
    if (type === 'clear') {
        earth.analyzation.measurement.clearResults()
        return
    }
    earth.analyzation.measurement.type = type
}
