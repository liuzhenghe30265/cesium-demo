export default {
  data () {
    return {
      routeTypeOptions: [
        {
          value: 2,
          label: '固定起飞航线'
        },
        {
          value: 3,
          label: '固定返航航线'
        },
        {
          value: 5,
          label: '固定巡检航线'
        }
      ]
    }
  },
  methods: {
    onButtonDown (event) {
      event.stopPropagation()
    }
  }
}