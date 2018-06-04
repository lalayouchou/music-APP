<template>
    <transition name="slide">
    <div class="singer-detail">
      songjie
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'singer-detail',
  computed: {
    ...mapGetters([
      'singer'
    ])
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
.slide-leave-active, .slide-enter-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
.singer-detail
 position: fixed
 z-index: 31
 top: 0
 left: 0
 bottom: 0
 right: 0
 background: $color-background
</style>
