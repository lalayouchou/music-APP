<template>
  <div class="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item of recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h2 class="list-title">热门歌单推荐</h2>
          <ul v-if="discList.length">
            <li v-for="item of discList" :key="item.content_id" class="item">
                <img v-lazy="item.cover" alt="" class="icon" width="60" height="60">
                <div class="text">
                  <h2 class="name">{{item.username}}</h2>
                  <p class="desc">{{item.title}}</p>
                </div>
            </li>
          </ul>
        </div>
        <loading v-if="!discList.length"></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {getRecommend, getDiscList} from '@/api/recommend.js'
import {ERR_OK} from '@/api/config.js'
export default {
  name: 'recommend',
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  mounted () {
    this._getRecommend()
    setTimeout(() => { this._getDiscList() }, 1000)
  },
  methods: {
    _getRecommend () {
      getRecommend()
        .then((data) => {
          if (data.code === ERR_OK) {
            this.recommends = data.data.slider
          }
        })
        .catch((e) => console.log(e))
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.recomPlaylist.data['v_hot']
          console.log(this.discList)
        }
      })
        .catch((e) => console.log(e))
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$refs.scroll._refresh()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          border-radius 3px
        .text
          flex: 1
          padding-left: 20px
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
