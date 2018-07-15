<template>
  <transition name="slide">
    <music-list
    class="toplist"
    :title="top.topTitle"
    :bgImage="picUrl"
    :songList="songList"
    :rank="rank"
    >
    </music-list>
  </transition>
</template>

<script>
import musicList from '../music-list/music-list.vue'
import {mapGetters} from 'vuex'
import {getMusicList} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'
export default {
  name: 'topList',
  components: {
    musicList
  },
  data () {
    return {
      songList: [],
      rank: true
    }
  },
  computed: {
    ...mapGetters(['top']),
    picUrl () {
      if (this.songList.length) {
        return this.songList[0].image
      }
      return ''
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.top.id) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      getMusicList(this.top.id)
        .then((res) => {
          if (res.code === ERR_OK) {
            this.songList = this.normalizeSongs(res.songlist)
          }
        })
        .catch((e) => console.log(e))
    },
    normalizeSongs (list) {
      let res = []
      list.forEach((song) => {
        const songData = song.data
        if (songData.songid && songData.albummid) {
          res.push(createSong(songData))
        }
      })
      return res
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
.toplist
 position: fixed
 z-index: 31
 top: 0
 left: 0
 bottom: 0
 right: 0
 background: $color-background
</style>
