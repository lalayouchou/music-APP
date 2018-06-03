<template>
  <div class="wrapper" ref="wrapper">
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
      default () {
        return []
      }
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
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => this._initialize(), 20)
  },
  watch: {
    data () {
      setTimeout(() => { this._refresh() }, 20)
    }
  },
  methods: {
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    _initialize () {
      if (!this.$refs.wrapper) return

      this.scroll = new BScroll(this.$refs.wrapper, {
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        eventPassthrough: this.eventPassthrough,
        probeType: this.probeType
      })

      if (this.listenScroll) {
        this.scroll.on('scroll', (e) => {
          this.$emit('scroll', e)
        })
      }
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
