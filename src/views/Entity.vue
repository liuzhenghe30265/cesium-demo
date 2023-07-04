<template>
  <div style="width: 100%; height: 100%">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%"
    />
    <el-image
      ref="preview"
      :src="url"
      :preview-src-list="srcList"
      style="display: none"
    />
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import '@/utils/PolylineTrailMaterialProperty'
import {
  makeCurve,
  scaleAnimate,
  opacityAnimate,
  colorOpacityAnimate,
  semiMinorAxisAnimate,
  semiMajorAxisAnimate
} from '@/utils/EntityAnimate'
import {
  translateByDirection,
  getVector,
  distancePos
} from '@/utils/CesiumUtils.js'
export default {
  data() {
    return {
      srcList: [],
      url: '',
      points: [
        {
          altitude: 68.72,
          latitude: 39.2012737,
          turnType: 2,
          index: 1,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.7421675,
          direction: -2,
          waypointNumber: 1,
          heading: -153.58
        },
        {
          altitude: 68.72,
          latitude: 39.198794949427224,
          turnType: 2,
          index: 2,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'MTIS63u5wJTW4PIm1%2FuVj64fYlbanlCfFZ8NTSoNRFW5n7wsbS1uOmddy6Ekypi60XsqhPXo6ao%2FULRa%2FrakUs0BlwxzWnqn56gP3zntyOSH7aATb6RRMNYBbhRXMGmVjcOL5BboYKPEALuRvJRsBfELaonP7QBfV1FkMRyvRWQ=',
              roll: 0,
              target_type: 10,
              action: 0,
              zoom: 2,
              target_id: 0,
              pitch: 45,
              pre_time: 1000,
              yaw: 0,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.740578538038,
          direction: -2,
          waypointNumber: 2,
          heading: -89.64
        },
        {
          altitude: 63.93,
          latitude: 39.19881218044091,
          turnType: 2,
          index: 3,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'Zy2Z5K0IWTsHhBRMRFmaJW2on%2FqQa9iolSeEvnbJh3doSQIs5mjrO8bdBZfrpT3n0WCyMUKOXLSaBTvkYTNdPsrLS1Ps8xBYRXRc2zNdz57v+dAfvBzR%2FIoTvWl0IH%2Fp9yYQHCv8%2FFVIL+HVOGlzfQXycB4%2F3lZDSkuELL6q22E=',
              roll: 0,
              target_type: 10,
              action: 1,
              zoom: 2,
              target_id: 0,
              pitch: 45,
              pre_time: 3000,
              yaw: 0,
              post_time: 1000
            },
            {
              actionIndex: 1,
              name: 'Sai4OUeRd+Ac6Uv3U%2F9wJPHtflBlHDmV2r20T3v7dqYk570l9kYx2sD5EeTH09iDvTzG%2F9MxNZtQkJUi%2F4+GFaIZtMxgKm1R+1b1T8BLjKiSBPVgKFahZ70dTbrROGTOjSc4QHx%2F6TDS6ZLJGiPe0iqBrQ5tPnHALa35E0LWaSU=',
              roll: 0,
              target_type: 10,
              action: 1,
              zoom: 2,
              target_id: 0,
              pitch: 45,
              pre_time: 3000,
              yaw: 0,
              post_time: 1000
            },
            {
              actionIndex: 1,
              name: 'fX1QTHLJnwj0FPevIEofVKyDUI47vOxuBX0FrOI9QT0mRMZ2T%2FE9Snoc%2FHcYnnisgHDjUg4YouPBHZZs5%2F%2FUIVuR7%2FazL5yM1OKBUoOPXfprS6C2oqxDcB+UPJjSMuaYFSlthPvkdLjlUzQrI9dO2j2hRyKYUBWMr7l2mcyJ2wc=',
              roll: 0,
              target_type: 10,
              action: 1,
              zoom: 3,
              target_id: 0,
              pitch: 52.142893346609696,
              pre_time: 3000,
              yaw: 0,
              post_time: 1500
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73705346721596,
          direction: 288.8864713432471,
          waypointNumber: 3,
          heading: 288.8864713432471
        },
        {
          altitude: 63.93,
          latitude: 39.19881533462183,
          turnType: 2,
          index: 4,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73640429348586,
          direction: -2,
          waypointNumber: 4,
          heading: 0
        },
        {
          altitude: 43.93,
          latitude: 39.19881533462183,
          turnType: 2,
          index: 5,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'OYMS9QH221YnJ2b1krVOiNl66%2FY2Z0CC%2Fx%2FiWksgdKa091kHcblWpPC8Xyc7yeEmSL1pSec0kan6bbpBI5s3aPswgn4soCSyJ3FYwE1IaJjkH923uzlJ8MoNFQgKwIxTBWXGL00+2ua0B3DJ5fR6S2aysmTehEAHDpodOge9pL8=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 270405,
              pitch: 3.8967558291583893,
              pre_time: 3000,
              yaw: 1.0253485445317299,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'hR31o5HOnIx%2FWJGAsP1koYwJXhN15pTE0nLqRAYUmz2e8buVBco6YYB3L9alVxXaxyjLvb0pRHbe9U81ZyOLRARwGqyexZCnh6QY1o4H1UWtMm6X2Im0OTcvHVGlsO6eSMesBTa0jQCTFWytIISXBqkne%2FePdzcfOuUFzfy0R8o=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 270408,
              pitch: 3.7270767424283826,
              pre_time: 3000,
              yaw: -1.0622905471089223,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73640429348586,
          direction: 47.88570183190478,
          waypointNumber: 5,
          heading: 47.88570183190478
        },
        {
          altitude: 36.8,
          latitude: 39.19879982828979,
          turnType: 2,
          index: 6,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'fWVPSmHm3tYDZdUpGgrcT9AQhF5ewblPO50KRJZ0CZgrt1HKD8GW6uD8mR%2FyOQ4Cv+qp%2FpkNUROBB3JAwCoETYgvNL%2FGUPcqgxr4egaHL8YYTS9Q+GtKLwWjEJmPhru8FK9kUE%2Fm0FdOKIC+wOJNw9qF7aF7xOnBQk%2FN0StPvnE=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 8,
              target_id: 270399,
              pitch: 4.001273864584326,
              pre_time: 3000,
              yaw: 0.8546970498813964,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'TC4vwKs02AM3ospAaN5hibDHk%2FlejZ9d6PSkla%2F+MBkOwAtGxfjFWPOGCFbhQ4DexQopEOIvpz7v5D5j34j3vhkFVLHz1RVrAOBC4+i9m+hu8fwRxXl0X6NyRxSzAiXFYhusJ8joDh7HKgw9+98kjMSC95qZnspbq4VNbh3mz6o=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 270402,
              pitch: 3.6164834588837897,
              pre_time: 3000,
              yaw: -0.8975100272709139,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641077686767,
          direction: 45.6589149530172,
          waypointNumber: 6,
          heading: 45.6589149530172
        },
        {
          altitude: 30.6875,
          latitude: 39.198808464964486,
          turnType: 2,
          index: 7,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'Cm8uTcQPjTm1teVsWd0HPREby0JPpGt4dFeDAptB+TJyhiu2i45rjYvCYyLksEynBg%2F17PFPUpdlIEuHJUCu7wl+k2K23jWyI5nDmm+ioccGQhWWOoDfa87gytHdmcO5tYxNQhY0B7u0bPNZrkNONJ1DcCppV2kENUEKvh45Wa4=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 270393,
              pitch: 3.7450555642106482,
              pre_time: 3000,
              yaw: 0.8520014375929758,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'TH8hRnG7O37GQ0Kav3XuHAP2ck3Addb9Fl42Ei9q9KLssJWoFRc3aQrVMIr86Tk24NJ%2FwYx6U679wGAXdh+xX2vvCtyh7PXahRYhBY8Dnhzx8J71RiGacJos0lwda9vDW8eK2Ct43FKXu3Hvh4OQP%2FwNKpbaGJHhngO%2Fmklxlsw=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 270396,
              pitch: 3.8844008044312224,
              pre_time: 3000,
              yaw: -0.8793923089143332,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641036225291,
          direction: 45.85657850541294,
          waypointNumber: 7,
          heading: 45.85657850541294
        },
        {
          altitude: 63.93,
          latitude: 39.19881533462183,
          turnType: 2,
          index: 8,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73640429348586,
          direction: -2,
          waypointNumber: 8,
          heading: 1.38
        },
        {
          altitude: 64.035,
          latitude: 39.199092434605575,
          turnType: 2,
          index: 9,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641293848584,
          direction: -2,
          waypointNumber: 9,
          heading: 0
        },
        {
          altitude: 44.035,
          latitude: 39.199092434605575,
          turnType: 2,
          index: 10,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'G9s00qBv8Xub3EFxhpzPF81PTIqjVX8iOJhFvl1Cqak3zdntwp0ULBbgdcNGC%2FKHosK7lr5mh8KqEbsvdPFy42vYkk6oB6ujXdEDinBfbMzlrlD55f2e+ULZwXe9HGMh9r2Pyww3kS+GNN%2F0vuqLlM4Ff0ADsciWASwz+4wSCg4=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 269474,
              pitch: 3.8222603163196944,
              pre_time: 3000,
              yaw: -1.145362629797351,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'c3sn%2FXZhcvj1bwcbXY1XjqQcJsQK3zajQYs2rMK9Meyl1%2F0h9ICYLZYy%2F6miVb87I97vTlCrRvdOk%2FlRlosaRBnlH+cg%2Fwa%2F0oPsH79u3DoWwvyxAbdabwFVy1tMtslF8fY+VwxDauDS+KdWOKj8WG3fit8qLENqUCOtFzeN+m0=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 269477,
              pitch: 3.8034765011923546,
              pre_time: 3000,
              yaw: 1.1862421209250291,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641293848584,
          direction: 134.03100842623542,
          waypointNumber: 10,
          heading: 134.03100842623542
        },
        {
          altitude: 36.9975,
          latitude: 39.19910597266718,
          turnType: 2,
          index: 11,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'Tgx9vueZ8Qfg+Gz4HgxfzEI8+WxxKO3TQ7sp5yjwdagZUoaTtFzRlbIDtGcB9NN35JQq3xnNDiUVPzlrIFPd%2F9sknvzMY3Wi2jDuVmx13YbZ7XgrnxJlTZY6DEnwOWp0OUplsNnwRCi9lFWKDetoSpekrsVjqfCx0CIlzuKjz3A=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 269468,
              pitch: 3.6898425770020147,
              pre_time: 3000,
              yaw: 1.1027318952354124,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'PoRdZViSlpX4iKmxqMI1FJWhbYmbre7e4C%2FIBCND29NWsPJ4fvp3vBjy+gz24o5Z4NIk3Kj0ynukzQt563SJEry90HMuGbq+dexIwgZZDYsVv06qj+4bENPtNspATFgt3a0g1dq8ySabnlAqxnnuQCsy7NWS8+d1tdVbkb1TUH0=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 269471,
              pitch: 3.9326158533196445,
              pre_time: 3000,
              yaw: -1.0688942622773945,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641889815696,
          direction: 135.77370333735928,
          waypointNumber: 11,
          heading: 135.77370333735928
        },
        {
          altitude: 30.595,
          latitude: 39.19909315865803,
          turnType: 2,
          index: 12,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'GMZdytPCl4LdsaRFqWc+SfQxsrsjFgdfum7WmpF7XYDdXZ1FRBT3Vj%2FCPwQ56FHN5iRUJzo53gu%2FjODDO%2F2ADzryFytzrLfuFMgkfUDQSMEms2tLeN5EkhtcahQYarELSYMSTcKOZV03%2Fm1mGfujfIT+WiD+bKXaXXRolDYwcCk=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 6,
              target_id: 269462,
              pitch: 3.9171861713194467,
              pre_time: 3000,
              yaw: -0.5959983534177004,
              post_time: 1000
            },
            {
              actionIndex: 2,
              name: 'hHWwjfaDjsdevG0wwFqsPTQBjP0KwrMXfGKYHyXyOLw6lAIrtdy6VyFfYVmOl05P3W7I+28spyE1aE6je4IdkvIlQjSCLUserlyVKzeW1ICzyoARdyVGjL65mWmbao98MkAfP%2F0YKM75YyTWP6hWAtcMe3f5P31Mv2uFsrIN7X8=',
              roll: 0,
              target_type: 4,
              action: 1,
              zoom: 5,
              target_id: 269465,
              pitch: 3.705304118688527,
              pre_time: 3000,
              yaw: 0.6230024170034794,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641152860836,
          direction: 133.6011550040397,
          waypointNumber: 12,
          heading: 133.6011550040397
        },
        {
          altitude: 30.595,
          latitude: 39.19909315865803,
          turnType: 2,
          index: 13,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'I5uWtyFJbH0b2cFc0%2FQUwbo30uJkFx%2F6cBAHD16CJZRPagtjNAHo6YBlh2Xf6KO4GDv5%2FSQ2ctwZaqV8oN%2Fx%2FvniaWrVu1sbL0qc0Ii5qgct2h%2FGu7rxgWSQHIdYUvHXP689H58PsslmlQnk15ATLXo9XjF5bdr1xx9PeHPUL4M=',
              roll: 0,
              target_type: 10,
              action: 1,
              zoom: 2,
              target_id: 0,
              pitch: 0,
              pre_time: 3000,
              yaw: 0,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641152860836,
          direction: 92.8886578648563,
          waypointNumber: 13,
          heading: 92.8886578648563
        },
        {
          altitude: 30.595,
          latitude: 39.19909315865803,
          turnType: 2,
          index: 14,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'I%2Frw5%2FdaYidRiyE8SlJEYxaWFuTkkAL+O1a7JG00HLR9wEgu+BdkfDRPjeoyDb4y%2FqVLKN5GJ9kDdp7I5bfZXRd6G%2Fn81HJiT5QG1tlZJjEb7pcqj6z0ulIzrkmoNQGECGc%2Fa0uaV%2F+5UXVzlgYoTCJ+pYJ9qmbSAgoJRh8Ba9w=',
              roll: 0,
              target_type: 10,
              action: 1,
              zoom: 2,
              target_id: 0,
              pitch: 0,
              pre_time: 3000,
              yaw: 0,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641152860836,
          direction: 267.6766967992813,
          waypointNumber: 14,
          heading: 267.6766967992813
        },
        {
          altitude: 64.035,
          latitude: 39.199092434605575,
          turnType: 2,
          index: 15,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.73641293848584,
          direction: -2,
          waypointNumber: 15,
          heading: 90.48
        },
        {
          altitude: 68.72,
          latitude: 39.1990652632048,
          turnType: 2,
          index: 16,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [
            {
              actionIndex: 1,
              name: 'gJY%2FYhpwEVAvErJIQrE%2F%2FcNhb9UIZL76izaQV4I%2FNe8Ei7TCPZ6x5deNzCnfCdaoHDttp1mIGtaNpv4DWwwuRDU%2FE023DOufT+OHtTfVLhI8G6GOsHDVSHg1GoKLZHAZ3kg3CyT+uRj2zoVEOcfIkWmbs4I6o6CwQs1vr5Op0ls=',
              roll: 0,
              target_type: 10,
              action: 0,
              zoom: 2,
              target_id: 0,
              pitch: 45,
              pre_time: 1000,
              yaw: 0,
              post_time: 1000
            }
          ],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.74058044519552,
          direction: -2,
          waypointNumber: 16,
          heading: 29.11
        },
        {
          altitude: 68.72,
          latitude: 39.2012737,
          turnType: 2,
          index: 17,
          lineId: '',
          speed: 10,
          routeName: '创汉二线_13#塔_创汉一线_13#塔_自动生成',
          organizationId: 0,
          routeId: 0,
          pointId: 0,
          propertyType: 3,
          singleType: 1,
          action: [],
          routeType: 5,
          towerSn: '11773653740391989490',
          longitude: 117.7421675,
          direction: -2,
          waypointNumber: 17,
          heading: -2
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    // const _this = this
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.

    // 清除实体
    // 方法一：通过 Entity 删除
    // viewer.entities.remove(Entity)
    // 方法二：通过 id 删除
    // viewer.entities.remove(viewer.entities.getById('xxx'))
    // 方法三：删除所有实体
    viewer.entities.removeAll()
    this.points.map((point, index) => {
      if (point.actionEntityList && point.actionEntityList.length > 0) {
        // 添加云台视角
        // point.actionEntityList.map((action, actionIndex) => {
        //   const length = 40
        //   let position = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
        //   const dir = getVector(point, point.heading)
        //   const forward_l = length * Math.cos(action.pitch * Math.PI / 180)
        //   position = translateByDirection(position, dir, forward_l)
        //   const y_offset = length * Math.sin(action.pitch * Math.PI / 180)
        //   const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
        //   const lat = Cesium.Math.toDegrees(cartographic.latitude)
        //   const lon = Cesium.Math.toDegrees(cartographic.longitude)
        //   position = new Cesium.Cartesian3.fromDegrees(lon, lat, point.altitude - y_offset)
        //   const entity = viewer.entities.add(new Cesium.Entity({
        //     position: position,
        //     orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll.fromDegrees(point.heading + action.yaw, 0, -1 * action.pitch)),
        //     box: {
        //       dimensions: new Cesium.Cartesian3(0.3, length * 2, 0.3),
        //       material: new Cesium.PolylineArrowMaterialProperty(
        //         new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
        //       ),
        //       outline: false
        //     }
        //   }))
        //   // 添加云台视角（圆锥）
        //   // const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(point.heading + 90), Cesium.Math.toRadians(Number(action.pitch) + 90), Cesium.Math.toRadians(0))
        //   // const cylinderEntity = viewer.entities.add(
        //   //   new Cesium.Entity({
        //   //     id: 'cylinder' + action.id,
        //   //     name: '圆锥',
        //   //     position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //   //     orientation: Cesium.Transforms.headingPitchRollQuaternion(
        //   //       Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //   //       hpr
        //   //     ),
        //   //     cylinder: {
        //   //       length: 40.0,
        //   //       topRadius: 0.0,
        //   //       bottomRadius: 0.1,
        //   //       heightReference: Cesium.HeightReference.NONE,
        //   //       fill: true,
        //   //       material: new Cesium.Color.fromCssColorString('#ffffff'),
        //   //       outline: false,
        //   //       outlineWidth: 1.0,
        //   //       numberOfVerticalLines: 16,
        //   //       shadows: Cesium.ShadowMode.DISABLED
        //   //       // slices: 4
        //   //     },
        //   //     scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        //   //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
        //   //   })
        //   // )
        // })
      }
      // return
      // 添加方向实体
      // const toPoint = distancePos(
      //   point.longitude,
      //   point.latitude,
      //   point.heading,
      //   20
      // )
      // const headingEntity = viewer.entities.add(
      //   new Cesium.Entity({
      //     id: 'heading' + index,
      //     name: 'headingLine',
      //     polyline: {
      //       positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      //         point.longitude,
      //         point.latitude,
      //         point.altitude,
      //         toPoint.longitude,
      //         toPoint.latitude,
      //         point.altitude
      //       ]),
      //       width: 10,
      //       material: new Cesium.PolylineArrowMaterialProperty(
      //         new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
      //       ),
      //       scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      //       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //         0.0,
      //         7000.0
      //       )
      //     }
      //   })
      // )
      // 点
      const entity = viewer.entities.add(
        new Cesium.Entity({
          id: 'point' + index,
          name: 'point',
          position: Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          ),
          data: {
            point
          },
          // point: new Cesium.PointGraphics({
          //   pixelSize: 4,
          //   heightReference: Cesium.HeightReference.NONE,
          //   color: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(0.4),
          //   outlineColor: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(0.4),
          //   outlineWidth: 1,
          //   pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
          //   translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(500, Number.MAX_VALUE), // 可视高度范围
          //   show: true
          // }),
          // billboard: {
          //   image: require('@/assets/images/point.png'),
          //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
          //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          //   scale: 1,
          //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          //     0.0,
          //     7000.0
          //   ),
          //   show: true
          // },
          ellipsoid: {
            radii: new Cesium.Cartesian3(0.5, 0.5, 0.5),
            material: new Cesium.PolylineGlowMaterialProperty({
              // color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1)
              color: Cesium.Color.AZURE
            }),
            show: true,
            scaleByDistance: new Cesium.NearFarScalar(10, 0.5, 400000, 0.3),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              7000.0
            ),
            zIndex: -1
          },
          label: {
            text: index + '',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: new Cesium.Color.fromCssColorString('#f00'),
            outlineColor: new Cesium.Color.fromCssColorString('#fff'),
            outlineWidth: 1,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            showBackground: false,
            backgroundColor: new Cesium.Color.fromCssColorString('#fff'),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              7000.0
            ),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            show: true
          }
          // 圆柱
          // cylinder: {
          //   topRadius: 10,
          //   bottomRadius: 100,
          //   heightReference: 0,
          //   length: 1000,
          //   material: new Cesium.ImageMaterialProperty({
          //     image: require('@/assets/images/circle.png'),
          //     repeat: new Cesium.Cartesian2(1.0, 1.0),
          //     transparent: true,
          //     color: new Cesium.CallbackProperty(function () {
          //       return Cesium.Color.WHITE.withAlpha(0.5)
          //     }, false)
          //   }),
          //   // material: new Cesium.Color(0.21, 0.66, 1, 0.4),
          //   show: true
          // }
          // 立方体
          // box: {
          //   dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
          //   material: new Cesium.Color.fromCssColorString('#fcb718').withAlpha(0.5),
          //   outline: true,
          //   outlineColor: new Cesium.Color.fromCssColorString('#fcb718')
          // }
        })
      )

      /**
      // 扩展（航点动作上拍照图片）
      if (point.action && point.action.length > 0) {
        point.action.map((action) => {
          const entity = viewer.entities.add(new Cesium.Entity({
            id: 'action' + action.id,
            name: 'action',
            position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            // orientation: Cesium.Transforms.headingPitchRollQuaternion(
            //   Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            //   new Cesium.HeadingPitchRoll(action.yaw, action.pitch, action.roll)
            // ),
            data: {
              action
            },
            plane: {
              plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, -50.0),
              dimensions: new Cesium.Cartesian2(100.0, 80.0),
              material: new Cesium.ImageMaterialProperty({
                image: action.src, // 图片以材质的方式填充
                repeat: new Cesium.Cartesian2(1, 1)
              })
            }
            // billboard: {
            //   width: 320,
            //   height: 150,
            //   // image: action.src,
            //   image: require('@/assets/images/pic.jpeg'),
            //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
            //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            //   // scale: 0.2,
            //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
            //   show: true
            // }
          }))
        })
      }
       */
    })

    // 线
    const _list = []
    this.points.map((point, index) => {
      _list.push(point.longitude)
      _list.push(point.latitude)
      _list.push(point.altitude)
    })
    // fromDegreesArrayHeights 计算出图形面的中点
    const polygon = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights(_list)
      )
    })
    const geometry = Cesium.PolygonGeometry.createGeometry(polygon)
    const center = geometry.boundingSphere.center
    const cartographic = Cesium.Cartographic.fromCartesian(
      center,
      viewer.scene.globe.ellipsoid,
      new Cesium.Cartographic()
    )
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const entity = viewer.entities.add(
      new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
        point: new Cesium.PointGraphics({
          pixelSize: 40,
          heightReference: Cesium.HeightReference.NONE,
          color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1),
          outlineColor: new Cesium.Color.fromCssColorString(
            '#FCB718'
          ).withAlpha(1),
          outlineWidth: 2.5,
          pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
          show: true
        })
      })
    )

    const lineEntity = viewer.entities.add(
      new Cesium.Entity({
        id: 'line',
        name: 'line',
        polyline: {
          // positions: Cesium.Cartesian3.fromDegreesArray([116.3, 39.9, 116.47958024969756, 39.84829594348535, 116.56374186776782, 39.87785704033606]), // 无高度，贴地
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(_list),
          // width: 2,
          // arcType: Cesium.ArcType.RHUMB,
          // material: new Cesium.PolylineDashMaterialProperty({
          //   color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1),
          //   dashLength: 5 // 短划线长度
          // }),
          // scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          //   0.0,
          //   7000.0
          // )
          width: 5,
          material: new Cesium.PolylineGlowMaterialProperty({
            // color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1)
            color: new Cesium.Color(0.09, 0.51, 0.99, 1.0)
          }),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            7000.0
          )
        }
      })
    )
    viewer.flyTo(lineEntity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(-30),
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(0)
      )
    })

    // 动画效果

    // 圆环扩散效果
    // http://www.bigemap.com/Public/offline/gl/EllipseGeometry.html?classFilter=ellipse
    const point1 = this.points[0]
    const point2 = this.points[1]
    const point3 = this.points[2]
    const point4 = this.points[3]

    // // 方式一：颜色填充
    // viewer.entities.add({
    //   position: Cesium.Cartesian3.fromDegrees(
    //     point1.longitude,
    //     point1.latitude,
    //     point1.altitude
    //   ),
    //   ellipse: {
    //     // semiMinorAxis: 500, // 椭圆半短轴的长度，单位为米
    //     // semiMajorAxis: 500, // 椭圆半长轴的长度，单位为米
    //     semiMinorAxis: semiMinorAxisAnimate(), // 动态效果
    //     semiMajorAxis: semiMajorAxisAnimate(),
    //     height: 100,
    //     material: Cesium.Color.RED.withAlpha(0.5),
    //     outlineColor: Cesium.Color.RED
    //     // extrudedHeight: undefined
    //   }
    // })

    // // 方式二：使用图片
    // viewer.entities.add({
    //   position: Cesium.Cartesian3.fromDegrees(
    //     point2.longitude,
    //     point2.latitude,
    //     point2.altitude
    //   ),
    //   ellipse: {
    //     semiMinorAxis: semiMinorAxisAnimate(), // 动态效果
    //     semiMajorAxis: semiMajorAxisAnimate(),
    //     height: point2.altitude,
    //     material: new Cesium.ImageMaterialProperty({
    //       image: require('@/assets/images/circle.png'),
    //       repeat: new Cesium.Cartesian2(1.0, 1.0),
    //       transparent: true,
    //       color: colorOpacityAnimate()
    //     })
    //   }
    // })

    // 获取到实体添加动画
    const entity1 = viewer.entities.getById('point' + 102883)
    if (entity1 && entity1.billboard) {
      entity1.billboard.color = opacityAnimate()
      entity1.billboard.scale = scaleAnimate()
    }

    // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // handler.setInputAction(function (event) {
    //   const picked = viewer.scene.pick(event.position)
    //   console.log(picked)
    //   const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
    //   const cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
    //   const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    //   const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    //   console.log('空间直角坐标系转经纬度', longitude, latitude, cartographic.height)
    //   if (!picked || !picked.id) {
    //     return
    //   }
    //   if (picked.id.data) {
    //     console.log(picked.id.data)
    //     const data = picked.id.data
    //     if (data.action && data.action.src) {
    //       _this.url = data.action.src
    //       _this.srcList = [_this.url]
    //       setTimeout(() => {
    //         _this.$refs.preview.clickHandler()
    //       }, 100)
    //     }
    //   }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 添加流动线纹理流动纹理
    // const flowMaterial = new Cesium.PolylineTrailMaterialProperty({
    //   color: Cesium.Color.RED,
    //   duration: 3000,
    //   trailImage: require('@/assets/images/colors.png')
    // })
    // const positions = makeCurve(
    //   Cesium.Cartesian3.fromDegrees(
    //     point1.longitude,
    //     point1.latitude,
    //     point1.altitude
    //   ),
    //   Cesium.Cartesian3.fromDegrees(
    //     point2.longitude,
    //     point2.latitude,
    //     point2.altitude
    //   )
    // )
    // viewer.entities.add({
    //   polyline: {
    //     positions: positions,
    //     width: 5,
    //     material: flowMaterial
    //   }
    // })

    // 添加 glb 模型
    let factor = 0
    const start = this.points[14]
    const end = this.points[15]
    const modelEntity = viewer.entities.add({
      name: 'glb 模型',
      // position: new Cesium.Cartesian3.fromDegrees(
      //   start.longitude,
      //   start.latitude,
      //   start.altitude
      // ),
      position: new Cesium.CallbackProperty(function () {
        if (factor > 5000) {
          factor = 0
        }
        factor++
        // 动态更新位置
        return Cesium.Cartesian3.lerp(
          new Cesium.Cartesian3.fromDegrees(
            start.longitude,
            start.latitude,
            start.altitude
          ),
          new Cesium.Cartesian3.fromDegrees(
            end.longitude,
            end.latitude,
            end.altitude
          ),
          factor / 5000.0,
          new Cesium.Cartesian3()
        )
      }, false),
      model: {
        uri: 'model/Cesium_Air.glb',
        minimumPixelSize: 256,
        maxumunScale: 20000
      }
    })
    // 聚焦模型
    viewer.trackedEntity = modelEntity
    // viewer.scene.preRender.addEventListener(listenDeviceCamera)

    // setTimeout(() => {
    //   viewer.trackedEntity = null
    //   viewer.scene.preRender.removeEventListener(listenDeviceCamera)
    // }, 5000)

    // function listenDeviceCamera() {
    //   // const entity = modelEntity
    //   // if (!entity) return
    //   // const time = viewer.clock.currentTime
    //   // const entityposition = Cesium.Property.getValueOrUndefined(
    //   //   entity.position,
    //   //   time,
    //   //   new Cesium.Cartesian3()
    //   // )
    //   // if (!entityposition) return
    //   // // const orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion())
    //   // const podOrientation = Cesium.Property.getValueOrUndefined(
    //   //   entity.podOrientation,
    //   //   time,
    //   //   new Cesium.Quaternion()
    //   // )
    //   if (!podOrientation) return
    //   viewer.scene.camera.setView({
    //     destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 5000.0),
    //     orientation: {
    //       heading: 0,
    //       pitch: 0,
    //       roll: 0
    //     }
    //     // orientation: new Cesium.HeadingPitchRoll.fromQuaternion(podOrientation)
    //   })
    // }
  },
  methods: {}
}
</script>

<style>
</style>
