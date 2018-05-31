<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" v-if="dots.length">
      <span v-for="(dot,index) of dots" class="dot"
      :key="index"
      :class="{'active': currentIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScorll from 'better-scroll'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initDots()
      this._initScroll()
      if (this.autoPlay) {
        this._play()
      }
      this._addEvent()
    })
  },
  activated () {
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated () {
    clearTimeout(this.timer)
  },
  beforeDestroy () {
    this._removeEvent()
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children
      let clientWidth = this.$refs.slider.clientWidth
      let width = 0
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].classList.add('slider-item')
        this.children[i].style.width = clientWidth + 'px'
        width += clientWidth
      }
      if (this.loop && !isResize) { // 只有第一次需要加2，因为第一次还没有在首尾添加一个元素
        width += 2 * clientWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initScroll () {
      const el = this.$refs.slider
      this.scroll = new BScorll(el, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        eventPassthrough: 'vertical'
      })
      this.scroll.on('scrollEnd', () => {
        let index = this.scroll.getCurrentPage().pageX
        this.currentIndex = index
        if (this.autoPlay) {
          this._play()
        }
      })
      this.scroll.on('beforeScrollStart', () => clearTimeout(this.timer))
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.scroll.next()
      }, this.interval)
    },
    _addEvent () {
      window.addEventListener('resize', () => {
        this._setSliderWidth(true)
        this.$nextTick(() => this.scroll.refresh())
      })
    },
    _removeEvent () {
      window.removeEventListener('resize', () => {
        this._setSliderWidth()
        this.$nextTick(() => this.scroll.refresh())
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.slider
  min-height: 1px
/*  为了保持有一个宽度值*/
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
