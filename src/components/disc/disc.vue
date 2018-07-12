<template>
  <transition name="slide">
    <music-list
    class="disc"
    :title="disc.title"
    :bgImage="disc.cover"
    >
    </music-list>
  </transition>
</template>

<script>
import musicList from '../music-list/music-list.vue'
import {mapGetters} from 'vuex'
import {getSongList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'

export default {
  name: 'Disc',
  components: {
    musicList
  },
  computed: {
    ...mapGetters([
      'disc' // 这里注意''
    ])
  },
  created () {
    this._normalize()
  },
  methods: {
    _normalize () {
      getSongList(this.disc['content_id']).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.cdlist)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
.slide-leave-active, .slide-enter-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
.disc
 position: fixed
 z-index: 31
 top: 0
 left: 0
 bottom: 0
 right: 0
 background: $color-background
</style>
