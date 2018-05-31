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
    data: {
      type: Array,
      default: []
    },
    click: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    eventPassthrough: {
      type: String,
      default: ''
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    setTimeout(() => this._initialize(), 1000)
  },
  watch: {
    data () {
      this._refresh()
    }
  },
  methods: {
    _initialize () {
      if (!this.$refs.scroll) return

      this.scroll = new BScroll(this.$refs.scroll, {
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        eventPassthrough: this.eventPassthrough,
        probeType: this.probeType
      })
    },
    _refresh () {
      this.scroll && this.scroll.refresh()
    },
    _enable () {
      this.scroll && this.scroll.enable()
    },
    _disable () {
      this.scroll && this.scroll.disable()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
