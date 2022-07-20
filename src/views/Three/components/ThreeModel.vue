<template>
  <div
    id="canvas_container"
    class="canvas_container" />
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-caller */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
export default {
  name: 'ThreeModel',
  props: {
    process: {
      type: Number,
      default: 0
    },
    yaw: {
      type: [Number, String],
      default: 0
    },
    pitch: {
      type: [Number, String],
      default: 0
    },
    roll: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      degList: [4, 5, 6],
      animateTimerDeg: null,
      animateTimerScale: null,
      animateTimer: null,
      timer: null,
      droneAnimateTimeScale: 1,
      droneMixer: null,
      droneClock: null,
      droneAnimationAction: null,
      droneModelAnimateTimer: null,
      droneModelMaxScale: 200,
      droneModelTranslateY: 80,
      droneModelInitScale: 90,
      droneModel: null,
      dockAnimateTimeScale: 0.05,
      dockMixer: null,
      dockClock: null,
      dockAnimationAction: null,
      dockModelTranslateYHide: -1200, // 机库消失的高度
      dockModelTranslateY: -400,
      dockModelInitScale: 55,
      dockModelOpen: false,
      dockModelPosition: 'up',
      droneDegPlay: false,
      dockModel: null,
      scene: null,
      camera: null,
      renderer: null,
      textureLoader: null,
      groupBox: null,
      control: null,
      enableRotate: null
    }
  },
  computed: {

  },
  watch: {
    process (val) {
      if (val == 1) {
        // 自检可用
        // 打开机库
        this.setModelOwnAnimateToggle(this.dockAnimationAction, true) // 打开机库
      } else if (val == 2) {
        // 更换吊舱
      } else if (val == 3) {
        // 更换电池
      } else if (val == 4) {
        // 起飞
        if (!this.dockModelOpen) {
          // 如果机库还未打开（打开页面的状态就是起飞）
          this.setModelVisible(this.dockModel, false) // 隐藏机库
          this.setModelOwnAnimateToggle(this.dockAnimationAction, true) // 打开机库
        }
        // 关闭机库
        this.setModelOwnAnimatePlay(this.droneAnimationAction, true) // 飞机转桨
        // this.setModelDeg(this.droneModel, true) // 飞机角度旋转
        this.droneDegPlay = true
        this.setModelAnimate(this.dockModel, 'down', this.dockModelTranslateYHide) // 机库下降消失
        this.setModelOwnAnimateToggle(this.dockAnimationAction, false) // 关闭机库
        this.setModelScale(this.droneModel, 'big', this.droneModelMaxScale) // 飞机放大
      } else if (val == 5) {
        // 回收
        if (this.dockModelPosition === 'up') {
          // 打开页面的状态就是回收
          if (!this.dockModelOpen) {
            return
          }
        }
        this.setModelVisible(this.dockModel, true) // 显示机库
        this.setModelAnimate(this.dockModel, 'up', this.dockModelTranslateY) // 机库还原
        this.setModelOwnAnimateToggle(this.dockAnimationAction, true) // 打开机库
        this.setModelScale(this.droneModel, 'small', this.droneModelMaxScale) // 飞机变小
      } else if (val == 6) {
        // 归位
        // this.setModelDeg(this.droneModel, false) // 停止飞机角度旋转并初始化角度
        this.setModelOwnAnimatePlay(this.droneAnimationAction, false) // 飞机停止转桨
        this.droneDegPlay = false
        this.setModelOwnAnimateToggle(this.dockAnimationAction, false) // 关闭机库
      } else if (val == 7) {
        // 待命
      } else {
      }
    },
    yaw (val) {
      this.degChange()
    },
    pitch (val) {
      this.degChange()
    },
    roll (val) {
      this.degChange()
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.clear()
  },
  methods: {
    // 模型角度动画
    setModelDeg (model, type) {
      const _this = this
      if (!model) {
        return
      }
      if (this.animateTimerDeg) {
        clearInterval(this.animateTimerDeg)
      }
      if (!type) {
        model.rotation.x = 0
        model.rotation.y = 0
        model.rotation.z = 0
        return
      }
      this.animateTimerDeg = setInterval(() => {
        // const randomVal = _this.degList[Math.floor(Math.random() * _this.degList.length)]
        // rotateX() 会接着上一帧的变化而改变
        // model.rotateX(THREE.MathUtils.degToRad(randomVal))
        // model.rotateY(THREE.MathUtils.degToRad(randomVal))
        // model.rotateZ(THREE.MathUtils.degToRad(randomVal))
        model.rotation.x = THREE.MathUtils.degToRad(_this.roll)
        model.rotation.y = THREE.MathUtils.degToRad(_this.pitch)
        model.rotation.z = THREE.MathUtils.degToRad(_this.yaw)
      }, 1000)
    },
    // 监听角度变化
    degChange () {
      // console.log('.......deg', this.yaw, this.pitch, this.roll)
      if (!this.droneModel) {
        return
      }
      if (!this.droneDegPlay) {
        return
      }
      this.droneModel.rotation.x = THREE.MathUtils.degToRad(this.roll)
      this.droneModel.rotation.y = THREE.MathUtils.degToRad(this.pitch)
      this.droneModel.rotation.z = THREE.MathUtils.degToRad(this.yaw)
    },
    // 模型缩放动画
    setModelScale (model, type, value) {
      const _this = this
      if (!model) {
        return
      }
      if (this.animateTimerScale) {
        clearInterval(this.animateTimerScale)
      }
      if (type === 'big') {
        let val = this.droneModelInitScale
        this.animateTimerScale = setInterval(() => {
          val += 1
          model.scale.set(val, val, val)
          if (val >= value) {
            clearInterval(_this.animateTimerScale)
            return
          }
        }, 50)
        // if (model.name === 'shengDrone') {
        //   // 飞机在放大时向下偏移一些
        // }
      } else if (type === 'small') {
        let val = value
        this.animateTimerScale = setInterval(() => {
          val += -1
          model.scale.set(val, val, val)
          if (val <= _this.droneModelInitScale) {
            clearInterval(_this.animateTimerScale)
            return
          }
        }, 50)
        // if (model.name === 'shengDrone') {
        //   // 飞机在缩小时向上偏移一些
        // }
      }
    },
    // 自定义模型动画
    setModelAnimate (model, type, value) {
      const _this = this
      if (!model) {
        return
      }
      if (model.name === 'shengDock') {
        this.dockModelPosition = type
      }
      if (this.animateTimer) {
        clearInterval(this.animateTimer)
      }
      this.animateTimer = setInterval(() => {
        if (type === 'up') {
          model.translateY(3)
          if (model.position.y >= value) {
            clearInterval(_this.animateTimer)
          }
        } else if (type === 'down') {
          model.translateY(-3)
          if (model.position.y <= value) {
            clearInterval(_this.animateTimer)
            _this.setModelVisible(_this.dockModel, false) // 隐藏机库
          }
        }
      }, 80)
    },
    // 设置模型显/隐
    setModelVisible (model, status) {
      if (model) {
        if (status) {
          model.visible = true
        } else {
          model.visible = false
        }
      }
    },
    // 模型自身动画开始/停止
    setModelOwnAnimatePlay (action, status) {
      if (!action) {
        return
      }
      if (status) {
        action.play()
      } else {
        action.stop()
      }
    },
    // 模型自身正/反动画
    setModelOwnAnimateToggle (action, status) {
      if (!action) {
        return
      }
      if (status) {
        // open
        action.paused = true
        action.timeScale = this.dockAnimateTimeScale
        action.paused = false
        action.play()
        this.dockModelOpen = true
      } else {
        // close
        action.paused = true
        action.timeScale = -(this.dockAnimateTimeScale)
        action.paused = false
        action.play()
        this.dockModelOpen = false
      }
    },
    clear () {
      window.cancelAnimationFrame(this.clearAnim)
    },
    async init () {
      const _this = this
      const element = document.getElementById('canvas_container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      // 场景
      this.scene = new THREE.Scene()
      // this.scene.background = new THREE.Color(0x000000, 0)
      this.scene.background = null

      // 相机
      const k = width / height // 窗口宽高比
      const s = 400 // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000) // 透视摄像机
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000) // 正交摄像机
      // 设置摄像机位置,相机方向逆X轴方向，倾斜向下看
      this.camera.position.set(0, 180, 360)
      // this.camera.rotation.order = 'YXZ'
      // 指向场景中心
      this.camera.lookAt(this.scene.position)

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      // 设置环境
      this.renderer.setClearColor(0x000000, 0)
      // 设置场景大小
      this.renderer.setSize(140, 140)
      // 渲染器开启阴影效果
      this.renderer.shadowMap.enabled = true

      // 纹理加载器
      this.textureLoader = new THREE.TextureLoader()

      // 组合对象
      this.groupBox = new THREE.Group()

      // 坐标轴
      // const axes = new THREE.AxesHelper(1000)
      // this.scene.add(axes)

      // 点光源
      const point = new THREE.PointLight(0xffffff)
      point.position.set(500, 300, 400) // 点光源位置
      this.scene.add(point) // 点光源添加到场景中

      // 环境光
      const ambient = new THREE.AmbientLight(0xffffff, 0.8)
      this.scene.add(ambient)

      element.appendChild(this.renderer.domElement)

      // 相机控件
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
      this.control.enableDamping = true
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
      this.control.dampingFactor = 0.5
      // 是否可以缩放
      this.control.enableZoom = true
      // 是否自动旋转
      this.control.autoRotate = false
      // 设置相机距离原点的最近距离
      this.control.minDistance = 20
      // 设置相机距离原点的最远距离
      this.control.maxDistance = 1000
      // 是否开启右键拖拽
      this.control.enablePan = true
      // 上下翻转的最大角度
      this.control.maxPolarAngle = 1.5
      // 上下翻转的最小角度
      this.control.minPolarAngle = 0.0
      // 是否可以旋转
      this.enableRotate = true

      // 加载模型
      const loader = new GLTFLoader()
      await loader.load('model/shengDock.glb', (gltf) => {
      // await loader.load(`${window.SITE_CONFIG['modelUrl']}gltf/shengDock.glb`, (gltf) => {
        gltf.scene.name = 'shengDock'
        gltf.scene.scale.set(_this.dockModelInitScale, _this.dockModelInitScale, _this.dockModelInitScale) //  设置模型大小缩放
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.translateY(_this.dockModelTranslateY)
        _this.dockMixer = new THREE.AnimationMixer(gltf.scene)
        _this.dockClock = new THREE.Clock()
        _this.dockAnimationAction = _this.dockMixer.clipAction(gltf.animations[0])
        _this.dockAnimationAction.timeScale = _this.dockAnimateTimeScale
        _this.dockAnimationAction.loop = THREE.LoopOnce
        _this.dockAnimationAction.clampWhenFinished = true
        _this.scene.add(gltf.scene)
        _this.dockModel = gltf.scene
        // _this.setModelOwnAnimateToggle(_this.dockAnimationAction, true) // 打开机库
      }, (_xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (_error) => {
        // console.error(error)
      })
      await loader.load('model/shengfeiji.glb', (gltf) => {
      // await loader.load(`${window.SITE_CONFIG['modelUrl']}gltf/shengfeiji.glb`, (gltf) => {
        gltf.scene.name = 'shengDrone'
        gltf.scene.scale.set(_this.droneModelInitScale, _this.droneModelInitScale, _this.droneModelInitScale) //  设置模型大小缩放
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.translateY(_this.droneModelTranslateY)
        _this.droneMixer = new THREE.AnimationMixer(gltf.scene)
        _this.droneClock = new THREE.Clock()
        _this.droneAnimationAction = _this.droneMixer.clipAction(gltf.animations[0])
        _this.droneAnimationAction.timeScale = _this.droneAnimateTimeScale
        // _this.droneAnimationAction.loop = THREE.LoopOnce
        _this.droneAnimationAction.clampWhenFinished = true
        _this.scene.add(gltf.scene)
        _this.droneModel = gltf.scene
        // _this.droneModel.rotateY(THREE.MathUtils.degToRad(45))
        // _this.droneModel.visible = false
      }, (_xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (_error) => {
        // console.error(error)
      })

      const animate = () => {
        // 循环调用函数
        this.clearAnim = requestAnimationFrame(animate)
        // 更新相机控件
        this.control.update()
        // 渲染界面
        this.renderer.render(this.scene, this.camera)
        if (this.dockMixer) {
          // dockClock.getDelta() 方法获得两帧的时间间隔
          // 更新混合器相关的时间
          this.dockMixer.update(this.dockClock.getDelta())
        }
        if (this.droneMixer) {
          // 更新混合器相关的时间
          this.droneMixer.update(this.droneClock.getDelta())
        }
      }
      animate()
    }
  }
}
</script>

<style lang="scss" scoped>
$pub-color: #fcb718;
.canvas_container {
  position: absolute;
  z-index: 999;
  top: 72%;
  left: 50%;
  width: 140px;
  height: 140px;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #fff;
}
</style>
