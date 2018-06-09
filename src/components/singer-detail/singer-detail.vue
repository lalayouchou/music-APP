<template>
    <transition name="slide">
    <music-list
    class="singer-detail"
    :songList="songList"
    :title="title"
    :bgImage="bgImage">
    </music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getDetail} from '@/api/singer.js'
import {createSong} from '@/api/song.js'
import {ERR_OK} from '@/api/config.js'
import musicList from '../music-list/music-list.vue'

export default {
  name: 'singer-detail',
  components: {
    musicList
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.pic
    }
  },
  data () {
    return {
      songList: []
    }
  },
  created () {
    this._getSongDetail()
  },
  methods: {
    _getSongDetail () {
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }
      getDetail(this.singer).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSong(res.data.list)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _normalizeSong (list) {
      let ret = []
      for (let i = 0; i < list.length; i++) {
        ret.push(createSong(list[i].musicData))
      }
      return ret
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
.singer-detail
 position: fixed
 z-index: 31
 top: 0
 left: 0
 bottom: 0
 right: 0
 background: $color-background
</style>
