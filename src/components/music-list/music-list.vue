<template>
    <div class="music-list">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">{{title}}</div>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="filter"></div>
        <div class="play-wrapper" ref="play">
          <div class="play" @click="random">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll
      :data="songList"
      :probeType = "probeType"
      :listenScroll = "listenScroll"
      class="list"
      @scroll = "handleScroll"
      ref="list">
        <song-list
        :songList="songList"
        class="song-list-wrapper"
        @select="handleSelect"
        ></song-list>
        <div class="loading-container" v-show="!songList.length">
          <loading></loading>
        </div>
      </scroll>
    </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import songList from '@/base/song-list/song-list.vue'
import {addPrefix} from 'common/js/dom'
import {mapActions} from 'vuex'

const RESERVED_HEIGHT = 44
const transform = addPrefix('transform')

export default {
  name: 'music-list',
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    Scroll,
    songList,
    Loading
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      // 使用内联style,需要使用具体属性，不然会覆盖其他的style，这里就不能写成background
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    // 必须在created创建，因为在挂载节点的时候需要使用到，上面有绑定的属性
    this._initializeScroll()
  },
  mounted () {
    this.bgHeight = this.$refs.bgImage.clientHeight
    this.$refs.list.$el.style.top = `${this.bgHeight}px`
    this.maxTranslateY = this.bgHeight - RESERVED_HEIGHT
  },
  watch: {
    scrollY (newY) {
      let zIndex = '0'
      let paddingTop = '70%'
      let height = '0'
      let scale = '1'
      let display = '' // 默认值，如果是这个，表示显示
      let translateY = -Math.min(this.maxTranslateY, newY) // 限制最大值
      let bgImage = this.$refs.bgImage
      let layer = this.$refs.layer
      let play = this.$refs.play

      if (newY < 0) {
        scale = 1 + -newY / this.maxTranslateY
        zIndex = '10'
      } else {
        // 在往下拉的时候，不触发以下移动，减少dom操作
        layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      }

      if (translateY === -this.maxTranslateY) { // 如果已经是最大移动距离，修改图片的大小，z-index，使得它可以在滚动内容的上方
        zIndex = '10'
        paddingTop = '0'
        height = RESERVED_HEIGHT + 'px'
        display = 'none'
      }

      bgImage.style['padding-top'] = paddingTop
      bgImage.style['height'] = height
      bgImage.style['z-index'] = zIndex
      bgImage.style[transform] = `scale(${scale})`

      play.style['display'] = display
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    handleScroll (e) {
      this.scrollY = -e.y | 0
    },
    handleSelect (item, index) {
      this.selectPlay({list: this.songList, index}) // 这里使用对象，因为那边有结构写法,注意这里的键名要和结构对象一样
    },
    _initializeScroll () {
      this.probeType = 3
      this.listenScroll = true
    },
    random () {
      this.selectRandomPlay({list: this.songList})
    },
    ...mapActions([
      'selectPlay',
      'selectRandomPlay'
    ])
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 11px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 44px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: 100%
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
