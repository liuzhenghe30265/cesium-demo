<template>
    <div style="width: 600px; height: 400px;z-index: 999;">
      <div
      id="playWnd"
      class="playWnd" />
    </div>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
export default {
  name: 'RtspLiveVideo',

  components: {
  },

  data () {
    return {
      videoUrlList: [],
      pubKey: '',
      initCount: 0, // 插件初始化的次数
      oWebControl: null
    }
  },

  computed: {
  },

  watch: {
  },

  mounted () {
    this.getUrl()
  },

  beforeDestroy () {
    // this.resetAllData()
    this.handleClose()
  },
  methods: {
    // 获取公钥
    getPubKey (callback) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'getRSAPubKey',
        argument: JSON.stringify({
          keyLength: 1024
        })
      }).then(function (oData) {
        if (oData.responseMsg.data) {
          this.pubKey = oData.responseMsg.data
          console.log('..............获取 pubKey 成功', this.pubKey)
          callback()
        }
      })
    },
    // 显示回调信息
    showCBInfo (szInfo, type) {
      // console.log('........CBInfo', szInfo, type)
      // if (type === 'error') {
      //     szInfo = "<div style='color: red;'>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") +
      //         " " + szInfo +
      //         "</div>";
      // } else {
      //     szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo +
      //         "</div>";
      // }
      // document.getElementById("cbInfo").innerHTML += szInfo;
    },
    // 设置窗口控制回调
    setCallbacks () {
      const _this = this
      this.oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: _this.cbIntegrationCallBack
      })
    },
    // 推送消息
    cbIntegrationCallBack (oData) {
      this.showCBInfo(JSON.stringify(oData.responseMsg))
    },
    // 开始预览视频
    startPreview () {
      const _this = this
      // let _list = [{
      //     "cameraIndexCode": "1",
      //     "streamMode": 0,
      //     "cameraName": "指挥中心",
      //     // "url": "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4", // 用 EasyPlayer 可播放
      //     "url": "rtsp://21.47.39.26:554/openUrl/4CnOWkw",
      //     "deviceType": 4,
      //     "smallEagleEyeAbility": 0,
      //     "gpuMode": 0,
      //     "wndId": 1
      // }]
      // let _list = list.replace(/(\s*)/g, "")
      const _argument = JSON.stringify({
        list: this.videoUrlList
      })
      this.oWebControl.JS_RequestInterface({
        funcName: 'startMultiPreview',
        argument: _argument
      }).then(function (oData) {
        console.log(
          '..............播放视频',
          oData)
        _this.showCBInfo(JSON
          .stringify(
            oData
              ? oData
                .responseMsg
              : ''))
      })
    },
    // 初始化视频
    initVideo () {
      const _this = this
      this.oWebControl.JS_RequestInterface({
        funcName: 'init',
        argument: JSON.stringify({
          playMode: 0, // 预览
          snapDir: 'd:\\SnapDir',
          videoDir: 'd:\\VideoDir',
          layout: '2x2',
          showToolbar: 1,
          showIntelligent: 1,
          buttonIDs: '0,16,256,257,258'
          // enableHTTPS: _this.enableHttps,
          // showToolbar: _this.showToolbar,
          // showSmart: _this.showSmart,
          // buttonIDs: btIds,
          // encryptedFields: encryptedFields
        })
      }).then(function (oData) {
        console.log('.......初始化视频成功', oData)
        _this.showCBInfo(JSON.stringify(oData
          ? oData
            .responseMsg
          : ''))
        _this.oWebControl.JS_Resize(600,
          420
        ) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        // 播放视频
        _this.startPreview()
      })
    },
    // 初始化插件
    initPlugin () {
      const _this = this
      this.oWebControl = new WebControl({
        szPluginContainer: 'playWnd',
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        cbConnectSuccess: function () {
          _this.setCallbacks()
          _this.oWebControl.JS_StartService('window', {
            dllPath: './VideoPluginConnect.dll'
            // dllPath: "./DllForTest-Win32.dll"
          }).then(function () {
            _this.oWebControl.JS_CreateWnd('playWnd', 600, 420).then(
              function () {
                console.log('........添加窗口成功')
                // 预览视频
                // _this.getPubKey(function () {
                _this.initVideo()
                // })
              })
          }, function () {

          })
        },
        cbConnectError: function () {
          console.log('...............连接失败，尝试重新启动')
          _this.oWebControl = null
          WebControl.JS_WakeUp('VideoWebPlugin://')
          _this.initCount++
          if (_this.initCount < 3) {
            setTimeout(function () {
              _this.initPlugin()
            }, 3000)
          } else {
            console.log('.............插件启动失败，请检查插件是否安装！')
          }
        },
        cbConnectClose: function () {
          console.log('........连接关闭')
          _this.oWebControl = null
        }
      })
    },
    // 获取视频流地址
    getUrl () {
      this.videoUrlList = [{
        'cameraIndexCode': '1',
        'streamMode': 0,
        'cameraName': '指挥中心',
        'url': 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
        'deviceType': 4,
        'smallEagleEyeAbility': 0,
        'gpuMode': 0,
        'wndId': 1
      }]
      this.initPlugin()
    },
    handleClose () {
      this.$emit('close')
      this.initCount = 0
      try {
        if (this.oWebControl) {
          this.oWebControl.JS_HideWnd() // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
          this.oWebControl.JS_Disconnect().then(function () { }, function () { })
        }
        setTimeout(() => {
          this.oWebControl = null
        }, 500)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .rtsp_live_video {
//   position: absolute;
//   z-index: 999;
//   top: 100px;
//   right: 140px;
//   box-sizing: border-box;
//   padding: 50px 30px 40px 30px;
//   transform-origin: left top;
//   width: 660px;
//   height: 510px;

//   .close {
//     position: absolute;
//     top: 0;
//     right: 0;
//     padding: 20px;
//     cursor: pointer;
//     font-size: 24px;
//     z-index: 1;
//   }
//   &::before {
//     position: absolute;
//     z-index: -1;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     content: '';
//     background-image: url(~@/assets/images/newUI/lineListBgNew.png);
//     background-size: 100% 100%;
//     backdrop-filter: blur(10px);
//   }
// }
.playWnd {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.cbInfoDiv {
  float: left;
  width: 360px;
  margin-left: 16px;
  border: 1px solid #7f9db9;
}
.cbInfo {
  height: 200px;
  padding: 5px;
  border: 1px solid #7f9db9;
  overflow: auto;
  word-break: break-all;
}
.operate {
  margin-top: 24px;
}
.operate::after {
  content: '';
  display: block;
  clear: both;
}
.operate .btns {
  height: 32px;
}
.module {
  float: left;
  width: 340px;
  min-height: 320px;
  margin-left: 16px;
  padding: 16px 8px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
}
.module .item {
  margin-bottom: 4px;
}
.module .label {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  text-align: right;
}
.module input[type='text'],
.module select {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0;
  width: 150px;
  min-height: 20px;
}
.module .btn {
  min-width: 80px;
  min-height: 24px;
  margin-top: 16px;
  margin-left: 158px;
}
</style>
