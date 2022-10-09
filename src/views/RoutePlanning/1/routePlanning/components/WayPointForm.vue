<template>
  <el-form
    ref="pointRuleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
    label-position="left">
    <el-form-item
      label="航点属性"
      prop="propertyType">
      <el-select
        v-model="ruleForm.propertyType"
        placeholder="请选择类型"
        :popper-append-to-body="false">
        <el-option
          v-for="item in pointTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      label="经度"
      prop="longitude">
      <el-input
        v-model="ruleForm.longitude"
        @input="handleLongitudeChange" />
    </el-form-item>
    <el-form-item
      label="纬度"
      prop="latitude">
      <el-input
        v-model="ruleForm.latitude"
        @input="handleLatitudeChange" />
    </el-form-item>
    <el-form-item
      label="高度"
      prop="altitude">
      <el-input
        v-model="ruleForm.altitude"
        @input="handleAltitudeChange" />
    </el-form-item>
    <el-form-item
      label="机头朝向"
      prop="heading">
      <el-input
        v-model="ruleForm.heading"
        @input="handleHeadingChange" />
    </el-form-item>
    <el-form-item
      label="飞行速度"
      prop="speed">
      <scale-slider
        ref="speedSlider"
        v-model="ruleForm.speed"
        :max="speedMax"
        :min="speedMin"
        @input="handleSpeedInput"
        @minus="handleSpeedMinus"
        @plus="handleSpeedPlus"
        @handleInput="handleSpeedInputCustom">
        <div
          slot="sliderContent"
          slot-scope="scope">
          {{scope.value}}
        </div>
      </scale-slider>
    </el-form-item>
    <!-- <el-form-item
      label="悬停时间"
      prop="time">
      <el-input
        v-model="ruleForm.time" />
    </el-form-item> -->
  </el-form>
</template>
<script>
import ScaleSlider from '@/viewer/hushi/modules/ScaleSlider'
import { debounce } from 'lodash'
export default {
  name: 'WayPointFrom',
  components: {
    ScaleSlider
  },
  props: {
    positionData: {
      type: Object,
      default () {
        return {}
      }
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      pointTypeOptions: [
        {
          value: 0,
          label: '任务点'
        },
        {
          value: 1,
          label: '起飞点'
        },
        {
          value: 2,
          label: '降落点'
        },
        {
          value: 3,
          label: '安全点'
        }
      ],
      rules: {
        waypointName: [
          { required: false, message: '请输入航点名称', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
          { pattern: /^[\\-\\+]?(0?\d{1,2}(\.\d{1,15})*|1[0-7]?\d{1}(\.\d{1,15})*|180(\.0{1,15})*)$/, message: '请输入正确的经度值' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' },
          { pattern: /^[\\-\\+]?([0-8]?\d{1}(\.\d{1,15})*|90(\.0{1,15})*)$/, message: '请输入正确的纬度值' }
        ],
        altitude: [
          { required: true, message: '请输入高度', trigger: 'blur' }
        ]
      },
      speedMax: 10,
      speedMin: 1,
      ruleForm: {
        routeId: 0,
        propertyType: 0,
        waypointName: '',
        longitude: '',
        latitude: '',
        altitude: '',
        // longitude: 117.71384417835911,
        // latitude: 39.077549549616585,
        // altitude: -3.809446227889607,
        heading: -2,
        speed: 10,
        time: ''
      }
    }
  },
  computed: {
  },
  watch: {
    positionData (val) {
      if (val) {
        this.ruleForm.longitude = val.longitude
        this.ruleForm.latitude = val.latitude
        this.ruleForm.altitude = val.altitude
      }
    },
    data (val) {
      if (val && val.waypointName) {
        this.ruleForm.routeId = val.routeId
        this.ruleForm.waypointName = this.$decrypt.decryptFunction(val.waypointName)
        this.ruleForm.longitude = val.longitude
        this.ruleForm.latitude = val.latitude
        this.ruleForm.altitude = val.altitude
        this.ruleForm.heading = val.heading
        this.ruleForm.speed = parseInt(val.speed)
        this.ruleForm.time = val.time
      } else {
        this.reset()
      }
    }
  },
  mounted () {
  },
  methods: {
    handleSpeedInputCustom (val) {
      this.ruleForm.speed = Number(val)
    },
    handleSpeedInput (val) {
      this.$refs.speedSlider.input = val
    },
    handleSpeedMinus () {
      if (this.ruleForm.speed < this.speedMin) {
        return
      }
      this.ruleForm.speed += -1
    },
    handleSpeedPlus () {
      if (this.ruleForm.speed > this.speedMax) {
        return
      }
      this.ruleForm.speed += 1
    },
    handleHeadingChange: debounce(function (val) {
      this.ruleForm.heading = val
      // this.$emit('input', this.ruleForm)
    }, 400),
    handleAltitudeChange: debounce(function (val) {
      this.ruleForm.altitude = val
      this.$emit('input', this.ruleForm)
    }, 400),
    handleLatitudeChange: debounce(function (val) {
      this.ruleForm.latitude = val
      this.$emit('input', this.ruleForm)
    }, 400),
    handleLongitudeChange: debounce(function (val) {
      this.ruleForm.longitude = val
      this.$emit('input', this.ruleForm)
    }, 400),
    reset () {
      this.$refs.pointRuleForm.resetFields()
    },
    submit (type, actionEntityList) {
      const _actionEntityList = actionEntityList || []
      this.$refs.pointRuleForm.validate((valid) => {
        if (valid) {
          if (type === 'edit') {
            this.$emit('edit', this.ruleForm, _actionEntityList)
          } else if (type === 'add') {
            this.$emit('add', this.ruleForm, _actionEntityList)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>