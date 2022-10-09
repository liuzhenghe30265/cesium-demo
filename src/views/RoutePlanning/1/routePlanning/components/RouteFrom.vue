<template>
  <el-form
    ref="routeForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    label-position="left"
    class="route_name_form">
    <el-form-item
      label="航线名称"
      prop="name">
      <el-input
        v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item
      label="航线类型"
      prop="routeType">
      <el-select
        v-model="ruleForm.routeType"
        placeholder="请选择类型"
        :popper-append-to-body="false">
        <el-option
          v-for="item in routeTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      label="航程"
      prop="">
      <el-input
        v-model="ruleForm.voyage"
        disabled />
    </el-form-item>
  </el-form>
</template>
<script>
import RoutePlanningMixins from '../mixin'
export default {
  name: 'RouteFrom',
  mixins: [RoutePlanningMixins],
  props: {
    voyage: {
      type: String,
      default: ''
    },
    from: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入航线名称', trigger: 'blur' }
        ],
        routeType: [
          { required: false, message: '请选择航线类型', trigger: 'blur' }
        ]
      },
      ruleForm: {
        voyage: '',
        name: '',
        routeType: 5
      }
    }
  },
  computed: {
  },
  watch: {
    voyage (val) {
      this.ruleForm.voyage = val
    },
    from (val) {
      this.ruleForm.name = val.routeNameDecode || ''
      this.ruleForm.routeType = val.type || 5
    }
  },
  mounted () {
  },
  methods: {
    reset () {
      this.$refs.routeForm.resetFields()
    },
    submit (type) {
      this.$refs.routeForm.validate((valid) => {
        if (valid) {
          if (type === 'save') {
            this.$emit('submit', this.ruleForm)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
