<template>
  <el-form
    ref="pointRuleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    label-position="left">
    <el-form-item
      label="动作名称"
      prop="actionName">
      <el-input
        v-model="ruleForm.actionName" />
    </el-form-item>
    <el-form-item
      label="偏航角"
      prop="yaw">
      <scale-slider
        ref="yawSlider"
        v-model="ruleForm.yaw"
        :max="180"
        :min="-180"
        @change="handleYawChange"
        @input="handleYawInput"
        @minus="handleYawMinus"
        @plus="handleYawPlus"
        @handleInput="handleYawInputCustom">
        <div
          slot="sliderContent"
          slot-scope="scope">
          {{scope.value}}°
        </div>
      </scale-slider>
    </el-form-item>
    <el-form-item
      label="俯仰角"
      prop="pitch">
      <scale-slider
        ref="pitchSlider"
        v-model="ruleForm.pitch"
        :min="-30"
        :max="90"
        @change="handlePitchChange"
        @input="handlePitchInput"
        @minus="handlePitchMinus"
        @plus="handlePitchPlus"
        @handleInput="handlePitchInputCustom">
        <div
          slot="sliderContent"
          slot-scope="scope">
          {{scope.value}}°
        </div>
      </scale-slider>
    </el-form-item>
    <el-form-item
      label="变焦数"
      prop="zoom">
      <scale-slider
        ref="zoomSlider"
        v-model="ruleForm.zoom"
        :min="1"
        :max="30"
        @change="handleZoomChange"
        @input="handleZoomInput"
        @minus="handleZoomMinus"
        @plus="handleZoomPlus"
        @handleInput="handleZoomInputCustom">
        <div
          slot="sliderContent"
          slot-scope="scope">
          {{scope.value}}X
        </div>
      </scale-slider>
    </el-form-item>
    <el-form-item
      label="动作"
      prop="camAction">
      <el-select
        v-model="ruleForm.camAction"
        placeholder="请选择动作"
        :popper-append-to-body="false">
        <el-option
          v-for="item in actionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      label="兴趣点类型"
      prop="targetType">
      <el-select
        v-model="ruleForm.targetType"
        placeholder="请选择兴趣点类型"
        :popper-append-to-body="false">
        <el-option
          v-for="item in targetTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      label="悬停时间"
      prop="preTime">
      <el-input
        v-model="ruleForm.preTime">
        <i slot="suffix"
          style="font-style: normal; margin-right: 10px">秒</i>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script>
/* eslint-disable no-unused-vars */
import ScaleSlider from '@/viewer/hushi/modules/ScaleSlider'
export default {
  name: 'ActionFrom',
  components: {
    ScaleSlider
  },
  props: {
    coneAngle: {
      type: Object,
      default () {
        return {}
      }
    },
    angleData: {
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
      value: 0,
      targetTypeOptions: [
        {
          value: 0,
          label: '绝缘子'
        },
        {
          value: 1,
          label: '导线挂点'
        },
        {
          value: 2,
          label: '地线挂点'
        },
        {
          value: 3,
          label: '无类型'
        }
      ],
      actionOptions: [
        {
          value: 0,
          label: '无动作'
        },
        {
          value: 1,
          label: '拍一张'
        }
        // {
        //   value: 2,
        //   label: '拍三张'
        // },
        // {
        //   value: 3,
        //   label: '等时间拍照'
        // },
        // {
        //   value: 4,
        //   label: '等间距拍照'
        // }
      ],
      rules: {
        actionName: [
          { required: true, message: '请输入动作名称', trigger: 'blur' }
        ],
        longitude: [
          { required: false, message: '请输入经度', trigger: 'blur' }
        ],
        latitude: [
          { required: false, message: '请输入纬度', trigger: 'blur' }
        ],
        altitude: [
          { required: false, message: '请输入高度', trigger: 'blur' }
        ]
      },
      ruleForm: {
        targetType: 3,
        preTime: 0,
        actionName: '',
        yaw: 0,
        pitch: 0,
        zoom: 1,
        camAction: 0
      }
    }
  },
  watch: {
    coneAngle (val) {
      console.log('..........coneAngle', val)
      if (val.yaw && val.pitch) {
        this.ruleForm.yaw = Number(val.yaw)
        this.ruleForm.pitch = Number(val.pitch)
      }
    },
    angleData (val) {
      if (val.yaw && val.pitch) {
        this.ruleForm.yaw = Number(val.yaw)
        this.ruleForm.pitch = Number(val.pitch)
        this.ruleForm.zoom = Number(val.zoom)
      }
    },
    data (val) {
      if (val && val.actionName) {
        this.ruleForm.actionName = this.$decrypt.decryptFunction(val.actionName)
        this.ruleForm.yaw = val.yaw
        this.ruleForm.pitch = val.pitch
        this.ruleForm.zoom = val.zoom
        this.$refs.yawSlider.input = val.yaw
        this.$refs.pitchSlider.input = val.pitch
        this.$refs.zoomSlider.input = val.zoom
        this.ruleForm.camAction = val.camAction
        this.ruleForm.preTime = val.preTime
        this.ruleForm.targetType = val.targetType
      } else {
        this.$refs.pointRuleForm.resetFields()
      }
    }
  },
  mounted () {
  },
  methods: {
    reset () {
      this.$refs.pointRuleForm.resetFields()
      this.$refs.yawSlider.input = 0
      this.$refs.pitchSlider.input = 0
      this.$refs.zoomSlider.input = 1
    },
    submit (type) {
      this.$refs.pointRuleForm.validate((valid) => {
        if (valid) {
          if (type === 'edit') {
            this.$emit('edit', this.ruleForm)
          } else if (type === 'add') {
            this.$emit('add', this.ruleForm)
          }
        } else {
          return false
        }
      })
    },
    // 偏航角
    handleYawInputCustom (val) {
      this.ruleForm.yaw = Number(val)
      this.$emit('change', this.ruleForm)
    },
    handleYawChange () { },
    handleYawInput (val) {
      this.$refs.yawSlider.input = val
      this.$emit('change', this.ruleForm)
    },
    handleYawMinus () {
      if (this.ruleForm.yaw < -180) {
        return
      }
      this.ruleForm.yaw += -1
      this.$emit('change', this.ruleForm)
    },
    handleYawPlus () {
      if (this.ruleForm.yaw > 180) {
        return
      }
      this.ruleForm.yaw += 1
      this.$emit('change', this.ruleForm)
    },

    // 俯仰角
    handlePitchInputCustom (val) {
      this.ruleForm.pitch = Number(val)
      this.$emit('change', this.ruleForm)
    },
    handlePitchChange () { },
    handlePitchInput (val) {
      this.$refs.pitchSlider.input = val
      this.$emit('change', this.ruleForm)
    },
    handlePitchMinus () {
      if (this.ruleForm.pitch < -30) {
        return
      }
      this.ruleForm.pitch += -1
      this.$emit('change', this.ruleForm)
    },
    handlePitchPlus () {
      if (this.ruleForm.pitch > 90) {
        return
      }
      this.ruleForm.pitch += 1
      this.$emit('change', this.ruleForm)
    },

    // 变焦数
    handleZoomInputCustom (val) {
      this.ruleForm.zoom = Number(val)
    },
    handleZoomChange () { },
    handleZoomInput (val) {
      this.$refs.zoomSlider.input = val
    },
    handleZoomMinus () {
      if (this.ruleForm.zoom < 1) {
        return
      }
      this.ruleForm.zoom += -1
    },
    handleZoomPlus () {
      if (this.ruleForm.zoom > 30) {
        return
      }
      this.ruleForm.zoom += 1
    }

  }
}
</script>