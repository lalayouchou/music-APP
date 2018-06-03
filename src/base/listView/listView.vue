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
          class="list-group-item">
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
  </scroll>
</template>

<script>
import scroll from '@/base/scroll/scroll.vue'
import {getData} from 'common/js/dom'
const ANCHOR_HEIGHT = 18
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
      scrollY: 0
    }
  },
  components: {
    scroll
  },
  created () {
    this.initialize()
  },
  computed: {
    shortcutList () {
      return this.data.map((val) => {
        return val.title.substr(0, 1)
      })
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
          return
        }
      }

      // 如果滚动到底部超出HeightList的最后一个数值，直接等于最后一个值
      this.currentIndex = this.listHeight.length - 2
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
      this.currentIndex = parseInt(index)
      el = this.$refs.listGroup[index]
      this.$refs.scroll.scrollToElement(el, 1)// 不添加懒加载不触发
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
