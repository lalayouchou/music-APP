<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <div>
        <div class="item"
        v-for="item of topList"
        :key="item.id"
        @click="selectItem(item)"
        >
          <div class="icon">
            <img v-lazy="item.picUrl" alt="" width="100" height="100">
          </div>
          <div class="songlist">
            <div class="song"
             v-for="(song, index) of item.songList" :key="index"
            >{{index+1}} {{song.songname}}-{{song.singername}}</div>
          </div>
        </div>
        <div class="loading-container" v-show="!topList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import loading from '@/base/loading/loading'
import {getTopList} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import Scroll from '@/base/scroll/scroll'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  name: 'Rank',
  components: {
    loading,
    Scroll
  },
  created () {
    this._getTopList()
  },
  data () {
    return {
      topList: []
    }
  },
  mixins: [playlistMixin],
  methods: {
    _getTopList () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem (item) {
      this.$router.push(`/rank/${item.id}`)
      this.setTop(item)
    },
    ...mapMutations({
      setTop: 'SET_TOP'
    }),
    handlePlayList (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .toplist
    height: 100%
    overflow: hidden
    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px
      &:last-child
        padding-bottom: 20px
      .icon
        flex: 0 0 100px
        width: 100px
        height: 100px
      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        .song
          no-wrap()
          line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
