// * 创建视锥

/* eslint-disable new-cap */
/* eslint-disable no-undef */
export default class CreateFrustum {
    constructor(options) {
        this.headingPitchRoll = options.headingPitchRoll
        // this.position = options.position
        this.position = Cesium.Cartesian3.fromDegrees(options.position.longitude, options.position.latitude, options.position.altitude)
        // this.orientation = options.orientation
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            this.position,
            new Cesium.HeadingPitchRoll.fromDegrees(this.headingPitchRoll.heading, this.headingPitchRoll.pitch, this.headingPitchRoll.roll)
        )
        this.fov = options.fov || 0
        this.near = options.near || 0
        this.far = options.far || 0
        this.aspectRatio = options.aspectRatio
        this.add()
    }

    // 更新视锥体的姿态
    update(position, headingPitchRoll) {
        this.position = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.altitude)
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            this.position,
            new Cesium.HeadingPitchRoll.fromDegrees(headingPitchRoll.heading, headingPitchRoll.pitch, headingPitchRoll.roll)
        )
        this.add()
    }

    // 创建视锥体和轮廓线
    add() {
        this.clear()
        this.addFrustum()
        this.addOutline()
    }

    // 清除视锥体和轮廓线
    clear() {
        this.clearFrustum()
        this.clearOutline()
    }

    // 清除视锥体
    clearFrustum() {
        if (this.frustumPrimitive) {
            viewer.scene.primitives.remove(this.frustumPrimitive)
            this.frustumPrimitive = null
        }
    }

    // 清除轮廓线
    clearOutline() {
        if (this.outlinePrimitive) {
            viewer.scene.primitives.remove(this.outlinePrimitive)
            this.outlinePrimitive = null
        }
    }

    // 创建视锥体
    addFrustum() {
        const frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角，绕Z轴旋转，以弧度方式输入
            fov: Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far
        })
        const geometry = new Cesium.FrustumGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        })
        const instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(1.0, 0.0, 0.0, 0.2)
                )
            }
        })
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true
            }),
            asynchronous: false
        })
        this.frustumPrimitive = viewer.scene.primitives.add(primitive)
    }

    // 创建轮廓线
    addOutline() {
        const frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角度，绕Z轴旋转，以弧度方式输入
            // The angle of the field of view (FOV), in radians.
            // This angle will be used as the horizontal FOV if the width is greater than the height, otherwise it will be the vertical FOV.
            fov: Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far
        })
        const geometry = new Cesium.FrustumOutlineGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        })
        const instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                )
            }
        })
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true
            }),
            asynchronous: false
        })
        this.outlinePrimitive = viewer.scene.primitives.add(primitive)
    }
}
