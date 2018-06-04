<template>
  <scroll
  class="listview"
  :probeType="probeType"
  :data="data"
  :listenScroll="listenScroll"
  ref="scroll"
  @scroll="_handleScroll"
  >
    <ul>
      <li v-for="(group, index) of data"
      :key="index"
      class="list-group"
      ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) of group.items"
          :key="index"
          class="list-group-item"
          @click="handleSelect(item)"
          >
            <img v-lazy="item.pic" :alt="item.name" class="avatar">
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <ul
    class="list-shortcut"
    @touchstart.stop.prevent="onShortcutTouchstart"
    @touchmove.stop.prevent="onShortcutTouchmove"
    >
      <li v-for="(item, index) of shortcutList"
      :key="index"
      class="item"
      :data-index="index"
      :class="{'current': currentIndex === index}"
      >{{item}}</li>
    </ul>
    <div class="list-fixed"
    v-show="fixedTitle"
    ref="fixedTitle"
    >
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import scroll from '@/base/scroll/scroll.vue'
import loading from '@/base/loading/loading.vue'
import {getData} from 'common/js/dom'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'listView',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      listHeight: [],
      scrollY: 0,
      diff: -1
    }
  },
  components: {
    scroll,
    loading
  },
  created () {
    this.initialize()
  },
  computed: {
    shortcutList () {
      return this.data.map((val) => {
        return val.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY <= 0) {
        return ''
      }
      return this.data[this.currentIndex].title ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        let listHeight = []
        let Height = 0
        listHeight.push(Height)
        let doms = this.$refs.listGroup
        for (let i = 0; i < doms.length; i++) {
          let clientHeight = doms[i].clientHeight
          Height += clientHeight
          listHeight.push(Height)
        }
        this.listHeight = listHeight
      }, 20)
    },
    scrollY (newY) {
      // 当滚动到顶部，向下拉的时候
      if (newY < 0) {
        this.currentIndex = 0
        return
      }

      // 滚动在中间位置的时候
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        let startHeight = this.listHeight[i]
        let endHeight = this.listHeight[i + 1]
        if (newY >= startHeight && newY < endHeight) {
          this.currentIndex = parseInt(i)
          this.diff = endHeight - this.scrollY
          return
        }
      }

      // 如果滚动到底部超出HeightList的最后一个数值，直接等于最后一个值
      this.currentIndex = this.listHeight.length - 2
    },
    diff (newDiff) {
      // 监听diff差值的变化，如果差值开始小于30，那么就需要执行偏移的命令，偏移值等于title的高度减去差值，差值为29，那么向上偏移1，向上方向为负值，所以要添加一个负号
      let offsetTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? TITLE_HEIGHT - newDiff
 : 0
      if (this.offsetTop === offsetTop) {
        return
      }
      // 这里设置限制条件，为了节省DOM操作，注意在offsetTop从其他值变成0的时候，需要执行一次DOM操作，使其变回原来的位置，所以添加了一个属性this.offsetTop = offsetTop，用来判断，如果上一次不为0 ，这次为0，执行，如果上一次和这一次都为0，不执行，直接返回
      this.offsetTop = offsetTop
      let el = this.$refs.fixedTitle
      el.style.transform = `translate3d(0, ${-offsetTop}px, 0)`
    }
  },
  methods: {
    initialize () {
      this.probeType = 3
      this.touch = {}
      this.listenScroll = true
    },
    onShortcutTouchstart (e) {
      const anchorIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.anchorIndex = anchorIndex
      this.touch.Y1 = firstTouch.clientY
      this._toScroll(anchorIndex)
    },
    onShortcutTouchmove (e) {
      const firstTouch = e.touches[0]
      this.touch.Y2 = firstTouch.clientY
      const changeIndex = ((this.touch.Y2 - this.touch.Y1) / ANCHOR_HEIGHT) | 0
      if (changeIndex) {
        const anchorIndex = parseInt(this.touch.anchorIndex) + changeIndex
        this._toScroll(anchorIndex)
      }
    },
    _handleScroll (e) {
      this.scrollY = -e.y | 0
    },
    _toScroll (index) {
      let el
      if (!index && index !== 0) {
        return
      }
      if (index <= 0) {
        index = 0
      }
      if (index >= this.data.length - 1) {
        index = this.data.length - 1
      }
      /*this.currentIndex = parseInt(index) 可以去掉，高亮纯粹通过监听scrollY来设置*/
      el = this.$refs.listGroup[index]
      this.$refs.scroll.scrollToElement(el, 1)// 不添加timing懒加载不触发，timing值不为0或空，会派发scroll事件
    },
    handleSelect (item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
