/* eslint-disable no-undef */
export function InitMap() {
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
    const viewer = new Cesium.Viewer('cesium-container', {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: true, // 是否显示左下角的仪表盘
        baseLayerPicker: true, // 是否显示图层选择器按钮，右上角那个地图图标
        fullscreenButton: true, // 是否显示全屏按钮
        vrButton: true, // 是否显示VR按钮
        geocoder: true, // 是否显示搜索按钮
        homeButton: true, // 是否显示主页按钮
        infoBox: true, // 是否显示提示信息
        sceneModePicker: true, // 是否显示右上角的模式切换按钮
        selectionIndicator: true, // 是否显示选取指示器组件
        timeline: true, // 是否显示下边的时间轴
        navigationHelpButton: true, // 是否显示右上角的帮助按钮
        navigationInstructionsInitiallyVisible: true, // 是否显示导航
        // scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
        // requestRenderMode: true,
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        }),
        contextOptions: {
            allowTextureFilterAnisotropic: false,
            webgl: {
                alpha: true
            },
            requestWebgl1: true
        }
    })
    window.viewer = viewer
}