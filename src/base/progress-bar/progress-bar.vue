<template>
  <div class="progress-bar"
  ref="progressBar"
  @click.stop="progressClick"
  >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
      class="progress-btn-wrapper"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      ref="progressBtn"
      >
        <div class="progress-btn"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {addPrefix} from 'common/js/dom'
const transform = addPrefix('transform')
const BUTTON_WIDTH = 16

export default {
  name: 'progressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    touchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth // 按钮的偏移等于进度条的宽度
    },
    touchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetLeft = Math.min(Math.max(this.touch.left + deltaX, 0), this.progressBarWidth - BUTTON_WIDTH)
      this._offset(offsetLeft)
    },
    touchEnd () {
      this.touch.initiated = false
      this._trigglePercent()
    },
    progressClick (e) {
      const startX = this.$refs.progressBar.getBoundingClientRect().left // 节点距离视口的值
      const endX = this.$refs.progressBar.getBoundingClientRect().right
      const deltaX = Math.min(endX - BUTTON_WIDTH, Math.max(e.pageX, startX)) - startX
      // 这里点击的时候，点击位置的最小值不能小于进度条的最小值区域，因为为了扩大点击范围，其子节点的部分区域是可以不在父节点区域内的，由于事件冒泡，这个时候e.pageX就会小于startX，点击位置的最大值不能大于endX - BUTTON_WIDTH,这个值的由来是由于进度条的左侧黄色区域的最大值
      this._offset(deltaX)
      // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
      // this._offset(e.offsetX)
      this._trigglePercent()
    },
    _offset (left) {
      this.$refs.progress.style.width = `${left}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${left}px, 0, 0)`
    },
    _trigglePercent () {
      let changePercent = this.$refs.progress.clientWidth / (this.progressBarWidth - BUTTON_WIDTH)
      changePercent = Math.min(changePercent, 1) // 这里发现有可能点击出现大于1的情况，由于是基础组件，所以需要处理，将其变成1，而不需要外部处理
      this.$emit('changePercent', changePercent)
    }
  },
  watch: {
    percent (newY) {
      if (this.touch.initiated) {
        return
      }
      this.progressBarWidth = this.progressBarWidth || this.$refs.progressBar.clientWidth
      const width = this.progressBarWidth - BUTTON_WIDTH
      const offsetLeft = newY * width
      this._offset(offsetLeft)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
