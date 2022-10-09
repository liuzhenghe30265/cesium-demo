<template>
  <div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      class="search_form">
      <el-form-item
        prop="routeType"
        class="select_item">
        <el-select
          v-model="searchForm.routeType"
          placeholder="航线类型"
          :popper-append-to-body="false"
          :class="{clear000 : searchForm.routeType && searchForm.routeType !== ''}"
          @change="handleChangeRouteType">
          <el-option
            v-for="item in routeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
        <!-- <i v-if="searchForm.routeType && searchForm.routeType !== ''"
          class="el-icon-circle-close default_clear"
          @click="handleClearRouteType" /> -->
      </el-form-item>
      <el-form-item
        prop="routeName"
        class="input_item">
        <el-input
          v-model="searchForm.routeName"
          type="text"
          placeholder="请输入内容"
          @input="handleInputRouteName" />
        <i class="search_btn"
          @click="handleSearch" />
      </el-form-item>
    </el-form>
    <div
      v-loading="loading"
      class="scroll-wrapper"
      element-loading-background="rgba(0, 0, 0, 0.3)">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="50">
        <li
          v-for="(item, index) of list"
          :key="index"
          :class="[{odd: index % 2 === 0}, {select: selectIndex === index}]"
          @click="handleItemClick(item, index)">
          {{ item.routeNameDecode }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import RoutePlanningMixins from '../../mixin'
import { getWaypoint } from '@/utils/hushi/httpData.js'
import { debounce } from 'lodash'

export default {
  name: 'List',
  mixins: [RoutePlanningMixins],
  props: {
    devicePosition: {
      type: Object,
      default () {
        return {}
      }
    },
    selectIndex: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      searchForm: {
        routeName: '',
        routeType: 5
      },
      latitude: null,
      longitude: null,
      totalPage: 100,
      list: [],
      page: 0,
      limit: 10,
      total: 0,
      loading: false
    }
  },
  watch: {
    devicePosition (val) {
      console.log('............devicePosition', val)
      if (val && val.longitude && val.latitude) {
        this.latitude = val.latitude
        this.longitude = val.longitude
        this.resetFun()
      }
    }
  },
  mounted () {
    this.setCenterPosition()
  },
  methods: {
    setCenterPosition () {
      const centerPosition = this.$tool.getCameraCenterPosition()
      this.longitude = centerPosition.longitude
      this.latitude = centerPosition.latitude
    },
    handleSearch () {
      this.resetFun()
    },
    handleClearRouteType () {
      this.searchForm.routeType = ''
      this.resetFun()
    },
    handleInputRouteName: debounce(function () {
      this.resetFun()
    }, 400),
    handleChangeRouteType () {
      this.resetFun()
    },
    deleteRouteFun (routeId) {
      this.$confirm('是否删除当前航线', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$confirm('删除中，请稍候', '提示', {
          showClose: false,
          showConfirmButton: false,
          showCancelButton: false
        })
        return this.$http({
          url: this.$http.addUrl('/api/v1/open/route/delete'),
          method: 'post',
          data: this.$http.adornData({
            routeId: routeId
          })
        }).then(({ data }) => {
          if (data.flag === 0) {
            this.resetFun()
            this.$emit('deleteSuccess')
            this.$msgbox.close()
          }
        }).catch(err => {
          console.log(err)
          this.$msgbox.close()
        })
      })
    },
    handleItemClick (item, index) {
      // 选中逻辑在父组件中
      this.$emit('select', item, index)
    },
    resetFun () {
      this.$emit('reset')
      this.setCenterPosition()
      this.page = 1
      this.list = []
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      const params = {
        page: this.page,
        limit: this.limit,
        latitude: this.latitude + 90,
        longitude: this.longitude + 180,
        // latitude: 129.0771201,
        // longitude: 297.7139439,
        routeType: this.searchForm.routeType,
        routeName: this.searchForm.routeName
      }
      getWaypoint(params).then((res) => {
        if (res.list && res.list.length > 0) {
          this.total = res.totalCount
          this.totalPage = res.totalPage
          const _list = res.list
          for (let i = 0; i < _list.length; i++) {
            this.list.push(_list[i])
          }
        }
        this.loading = false
      })
    },
    loadMore () {
      this.page += 1
      if (this.page > this.totalPage) {
        return
      }
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.search_form {
  display: flex;
  ::v-deep input {
    resize: none;
    user-select: auto;
  }
  ::v-deep .el-input__inner {
    height: 0.4rem !important;
    line-height: 0.4rem !important;
    margin-top: 0;
    color: #ffffff;
    border: none;
    border-radius: 0;
    border-radius: 0.06rem;
    outline: none;
    background: rgba(255, 255, 255, 0.2);
  }
  ::v-deep .el-form-item__content {
    height: 0.4rem !important;
    line-height: 0.4rem !important;
  }
  .search_btn {
    position: absolute;
    top: 50%;
    right: 0.1rem;
    width: 0.18rem;
    height: 0.2rem;
    cursor: pointer;
    transform: translateY(-50%);
    background-image: url(~@/assets/images/common/searchIcon.png);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .select_item {
    position: relative;
    width: 1.4rem;
    ::v-deep .el-input__inner {
      padding: 0 0.34rem 0 0.12rem;
    }
    .default_clear {
      line-height: 0.4rem;
      position: absolute;
      top: 0;
      right: 0.1rem;
      height: 0.4rem;
      cursor: pointer;
    }
    ::v-deep .el-select__caret {
      line-height: 0.4rem !important;
    }
    .clear {
      ::v-deep .el-select__caret {
        display: none !important;
      }
    }
  }
  .input_item {
    flex: 1;
    ::v-deep .el-input__inner {
      padding: 0.12rem 0.4rem 0.12rem 0.15rem;
    }
  }
}
.scroll-wrapper {
  overflow: auto;
  width: 100%;
  height: 4.2rem;
  border-radius: 0.06rem;
  background: rgba(25, 25, 25, 0.4);
  ul {
    li {
      font-family: SourceHanSansCN-Normal;
      font-size: 0.16rem;
      display: block;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      min-height: 0.45rem;
      padding: 0.12rem 0.15rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #ffffff;
      &.odd {
        background: rgba(99, 99, 99, 0.3);
      }
      &.select {
        color: #fcb718;
      }
    }
  }
}
</style>
