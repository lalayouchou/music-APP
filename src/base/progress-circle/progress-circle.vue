<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" version="1.1" viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg">
      <circle r="50" cx="50" cy="50" fill="transparent" class="progress-background" />
      <circle r="50" cx="50" cy="50" fill="transparent" class="progress-bar"
      :stroke-dashoffset="dashOffset"
      :stroke-dasharray="dashArray" />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'progress-circle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashArray () {
      return Math.PI * 100 // 这里指的是视窗宽度，是不变的100，表示虚线的实线长度，和虚线的虚线长度，这里是相等的，只有一个值
    },
    dashOffset () {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.progress-circle
  position: relative
  circle
    stroke-width: 8px
    transform-origin: center
    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d
    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
