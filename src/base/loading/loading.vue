<template>
  <div class="wrapper" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean
      default: true
    },
    click: {
      type: Boolean
      default: true
    },
  },
  mounted () {
    this._initialize()
  },
  methods: {
    _initialize () {
      this.scroll = new BScroll(this.$refs.scroll, {
        click: true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  