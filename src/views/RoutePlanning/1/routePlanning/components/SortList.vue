<template>
  <div
    :class="'draggable_' + name">
    <vuedraggable
      v-model="sortList"
      @change="change"
      handle=".pl_sort"
      @start="start"
      @end="end">
      <transition-group>
        <div
          v-for="(item, index) of sortList"
          :key="index + 'sort'"
          class="point_li"
          :class="[{change: index % 2 === 0 }, {select: selectIndex === index}]"
          @click="handleItemClick(item, index)"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @mousedown="onButtonDown"
          @touchstart="onButtonDown">
          <div
            v-if="name === 'wayPoint'"
            class="point_li_inner">
            <div
              class="pl_index">
              航点{{ index + 1 }}：
            </div>
            <div
              class="pl_name">
              {{ setWayPointNameVal(item) }}
              <div
                class="badge"
                v-if="item.actionEntityList && item.actionEntityList.length > 0">
                {{ item.actionEntityList.length }}
              </div>
            </div>
            <img
              class="pl_sort"
              :src="require('@/assets/images/controls/routePlanning/sort.png')"
              alt="">
          </div>
          <div
            v-else
            class="point_li_inner">
            <div
              class="pl_index">
              {{ index + 1 }}：
            </div>
            <div
              class="pl_name">
              {{ setActionNameVal(item) }}
            </div>
            <img
              class="pl_sort"
              :src="require('@/assets/images/controls/routePlanning/sort.png')"
              alt="">
          </div>
        </div>
      </transition-group>
    </vuedraggable>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
export default {
  name: 'SortList',
  components: {
    vuedraggable
  },
  props: {
    selectIndex: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isClick: false,
      dragging: false,
      sortList: []
    }
  },
  computed: {
    setActionNameVal () {
      return (data) => {
        const value = '偏航角：' + data.yaw + '°；' + '俯仰角：' + data.pitch + '°；' + '变焦数：' + data.zoom + 'X'
        return value
      }
    },
    setWayPointNameVal () {
      return (data) => {
        const value = Number(data.longitude).toFixed(7) + '，' + Number(data.latitude).toFixed(7) + '；H：' + Number(data.altitude).toFixed(2)
        return value
      }
    },
    handleDecryption () {
      return (name) => {
        return this.$decrypt.decryptFunction(name)
      }
    }
  },
  watch: {
    list (val) {
      this.sortList = val
      this.$emit('sort', this.sortList)
    }
  },
  mounted () {
  },
  // updated () {
  //   console.log('............updated', this.sortList)
  // },
  methods: {
    handlePitchItemByIndex (index, source) {
      const _data = this.sortList[index]
      this.handleItemClick(_data, index, source)
    },
    start () { },
    end () {
      this.$emit('sort', this.sortList)
    },
    change () { },
    onDragEnd () {
      if (this.dragging) {
        /*
         * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
         * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
         */
        setTimeout(() => {
          this.dragging = false
          if (!this.isClick) {
            this.setPosition(this.newPosition)
            this.$parent.emitChange()
          }
        }, 0)
        window.removeEventListener('mousemove', this.onDragging)
        window.removeEventListener('touchmove', this.onDragging)
        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('touchend', this.onDragEnd)
        window.removeEventListener('contextmenu', this.onDragEnd)
      }
    },
    onDragging (event) {
      if (this.dragging) {
        this.isClick = false
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY
          event.clientX = event.touches[0].clientX
        }
      }
    },
    onDragStart (event) {
      this.dragging = true
      this.isClick = true
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY
        event.clientX = event.touches[0].clientX
      }
    },
    onButtonDown (event) {
      event.stopPropagation()
      // this.onDragStart(event)
      // window.addEventListener('mousemove', this.onDragging)
      // window.addEventListener('touchmove', this.onDragging)
      // window.addEventListener('mouseup', this.onDragEnd)
      // window.addEventListener('touchend', this.onDragEnd)
      // window.addEventListener('contextmenu', this.onDragEnd)
    },
    handleMouseLeave () {

    },
    handleMouseEnter () {

    },
    chooseItem () {
      const index = this.sortList.length - 1
      const data = this.sortList[index]
      this.handleItemClick(data, index)
    },
    handleItemClick (data, index, source) {
      if (this.name === 'wayPoint') {
        data.direction = data.heading
        data.action = data.camAction
      }
      this.$emit('select', data, index, source)
    },
    handleSwiperLeft () {
      console.log('....left')
    },
    handleChange () {
      console.log('.........change', this.wayPointList)
    },
    handleDelWayPoint (data) {
      console.log('.......del', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.point_li {
  padding: 0.09rem 0.04rem 0.09rem 0.12rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border: 1px solid transparent;
  .point_li_inner {
    display: flex;
    align-items: center;
    font-size: 0.16rem;
  }
  .pl_name {
    flex: 1;
    padding: 0 0.08rem;
    position: relative;
    .badge {
      font-family: SourceHanSansCN-Regular;
      font-size: 0.12rem;
      font-weight: normal;
      line-height: 0.12rem;
      position: absolute;
      top: -0.1rem;
      right: -0.1rem;
      padding: 0.02rem 0.05rem;
      letter-spacing: 0;
      color: #ffffff;
      border-radius: 50%;
      background: #e42a26;
    }
  }
  .pl_sort {
    width: 0.2rem;
    height: 0.14rem;
    cursor: move;
  }
  &.change {
    background: rgba(255, 255, 255, 0.1);
  }
  &.select {
    color: #fcb718;
    border: 1px solid #fcb718;
  }
}
.draggable_action {
  .point_li {
    &.change {
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
