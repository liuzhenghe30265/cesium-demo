/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils/common.js'

// * 绘制设备图形

export default class DrawDeviceUtil {
    /**
     * @param {*}
     * @memberof DrawDeviceUtil
     */
    constructor(options) {
        this.matrix3Scratch = null
        this.orientationScratch = null
        this.lockScratch = null
        this.lockEntity = null
        this.devices = {}
        this.eventHandler = null
    }

    getModelMatrix (entity, time, result) {
        const entityposition = Cesium.Property.getValueOrUndefined(
            entity.position,
            time,
            new Cesium.Cartesian3()
        )
        if (!entityposition) return null
        let position = cartesianToLongAndLat(entityposition)
        if (!position) return null
        position = Cesium.Cartesian3.fromDegrees(
            position.longitude,
            position.latitude,
            position.altitude
        )
        if (!Cesium.defined(position)) {
            return undefined
        }
        const orientation = Cesium.Property.getValueOrUndefined(
            entity.orientation,
            time,
            this.orientationScratch
        )
        if (Cesium.defined(orientation)) {
            result = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Matrix3.fromQuaternion(orientation, this.matrix3Scratch),
                position,
                result
            )
        } else {
            result = Cesium.Transforms.eastNorthUpToFixedFrame(
                position,
                undefined,
                result
            )
        }
        return result
    }
    eventListenerBind () {
        // 解决 addEventListener 使用了 bind(this)，eventListener 中虽然可以拿到 this，但 removeEventListener 无法移除 eventListener
        if (this.lockEntity) {
            if (this.getModelMatrix(this.lockEntity, viewer.clock.currentTime, this.lockScratch)) {
                viewer.scene.camera.lookAtTransform(this.lockScratch, new Cesium.Cartesian3(-20, 0, 10))
            } else {
                viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
            }
        } else {
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        }
    }
    eventListener = this.eventListenerBind.bind(this)
    UnLockEntity () {
        this.lockEntity = null
        viewer.scene.preRender.removeEventListener(this.eventListener)
    }
    LockEntity (id) {
        this.UnLockEntity()
        if (this.devices[id]) {
            const entity = this.devices[id]
            this.lockEntity = entity
            this.lockScratch = new Cesium.Matrix4()
            this.matrix3Scratch = new Cesium.Matrix3()
            this.orientationScratch = new Cesium.Quaternion()
            viewer.scene.preRender.addEventListener(this.eventListener)
        }
    }

    FlyToEntity (id) {
        if (this.devices[id]) {
            const entity = this.devices[id]
            viewer.flyTo(entity, {
                duration: 1
            })
        }
    }

    UpdatePosition (id, position) {
        if (this.devices[id]) {
            const entity = this.devices[id]
            const p2 = new Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.altitude
            )
            const start = viewer.clock.currentTime
            const time = 0.7
            const stop = Cesium.JulianDate.addSeconds(
                start,
                time,
                new Cesium.JulianDate()
            )
            entity.position.addSample(stop, p2)
        }
    }

    addDevice (data) {
        const animate = {
            pointWidth: 20,
            alp: 0.8,
            r: 0,
            g: 1,
            b: 0
        }
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(
                data.position.longitude,
                data.position.latitude,
                data.position.altitude
            ),
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(0),
                Cesium.Math.toRadians(0),
                Cesium.Math.toRadians(0)
            )
        )
        const options = {
            position: new Cesium.SampledPositionProperty(),
            // position: new Cesium.Cartesian3.fromDegrees(
            //     data.position.longitude,
            //     data.position.latitude,
            //     data.position.altitude
            // ),
            orientation: orientation,
            model: {
                runAnimations: false,
                uri: data.uri,
                scale: data.scale
            },
            point: {
                pixelSize: new Cesium.CallbackProperty(function () {
                    animate.pointWidth += 0.2
                    if (animate.pointWidth >= 35) {
                        animate.pointWidth = 25
                    }
                    return animate.pointWidth
                }, false),
                color: new Cesium.CallbackProperty(function () {
                    animate.alp -= 0.01
                    if (animate.alp <= 0.3) {
                        animate.alp = 0.8
                    }
                    return new Cesium.Color(animate.r, animate.g, animate.b, animate.alp)
                }, false),
                outlineWidth: 0,
                scaleByDistance: new Cesium.NearFarScalar(110, 1, 400000, 0.6),
                show: true
            },
            path: {
                show: true,
                leadTime: 0,
                trailTime: 3600,
                width: 2,
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.3,
                    taperPower: 1,
                    color: Cesium.Color.PALEGOLDENROD
                })
            }
        }
        const entity = viewer.entities.add(options)
        return entity
    }

    AddDevices (list) {
        if (list && list.length) {
            for (let index = 0; index < list.length; index++) {
                const device = list[index]
                if (!this.devices[device.id]) {
                    this.devices[device.id] = this.addDevice(device)
                }
            }
        }
    }

    removeInputActionFun () {
        if (this.eventHandler) {
            this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }
    }

    initInputActionFun () {
        this.removeInputActionFun()
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        this.eventHandler.setInputAction(function (event) {

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.eventHandler.setInputAction(function (movement) {

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    Init () {
        this.initInputActionFun()
    }

    Destory () {
        this.removeInputActionFun()
        this.eventHandler = null
    }
}
