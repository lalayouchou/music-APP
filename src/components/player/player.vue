<template>
  <div class="player" v-show="playList.length > 0">
    <transition
    name="normal"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%" :class="cdClass">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <div class="title" v-html="currentSong.name"></div>
          <div class="subtitle" v-html="currentSong.singer"></div>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" alt="" class="image" :class="cdClass">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{Math.min(currentTime, currentSong.duration) | format}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
              :percent="percent"
              @changePercent="timeChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration | format}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="togglePlayMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disableClass">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disableClass">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" alt="" width="40" height="40" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url"
    @canplay="ready"
    @error="error"
    @timeupdate="timeupdate"
    @ended="end"
    ref="audio"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Animation from 'create-keyframe-animation'
import {addPrefix} from 'common/js/dom'
import {addZero, shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import progressBar from '@/base/progress-bar/progress-bar'
import progressCircle from '@/base/progress-circle/progress-circle'
const transform = addPrefix('transform')

export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      PosAndScale: {},
      currentTime: 0
    }
  },
  components: {
    progressBar,
    progressCircle
  },
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'currentIndex',
      'playing',
      'mode',
      'sequenceList' // 这个数组是一直不会发生变化的，变化的是播放列表
    ]),
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdClass () {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.PosAndScale = this._getPosAndScale()
    })
  },
  watch: {
    playing (newVal) {
      // 这里为什么要使用this.$nextTick(),因为在这个时候还在通过src加载音频，这个时候不能调用play()方法，会报错
      this.$nextTick(() => {
        if (newVal) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      })
    },
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.currentSong.getLyric() // 因为歌词最后获取后是当前歌曲的属性，所以在当前歌曲监听函数里面调用
      })
    }
  },
  filters: {
    format (time) {
      time = time | 0
      const minute = time / 60 | 0
      const second = addZero(time % 60)
      return `${minute}:${second}`
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlaying(!this.playing)
    },
    prev () {
      // 如果songReady不是true，也就是歌曲还没有加载到可以播放，那就不能点击下一首或者上一首
      if (!this.songReady) {
        return
      }
      let currentIndex = this.currentIndex
      if (currentIndex === 0) {
        currentIndex = this.playList.length - 1
      } else {
        currentIndex--
      }
      this.setCurrentIndex(currentIndex)
      if (!this.playing) {
        this.setPlaying(true)
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) {
        return
      }
      let currentIndex = this.currentIndex
      if (currentIndex === this.playList.length - 1) {
        currentIndex = 0
      } else {
        currentIndex++
      }
      this.setCurrentIndex(currentIndex)
      if (!this.playing) {
        this.setPlaying(true)
      }
      this.songReady = false
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    enter (el, done) {
      let {x, y, scale} = this.PosAndScale

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 使用create-keyframe-animation库，注册动画
      Animation.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 300,
          easing: 'linear'
        }
      })
      // 使用create-keyframe-animation库，开始动画，并且传入回调函数
      Animation.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      // 消除注册的动画，也就是@keyframes
      Animation.unregisterAnimation('move')
      // 将节点的animation属性设置为空
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      let {x, y, scale} = this.PosAndScale
      // 这里没有使用动画库，因为这里是直接从原点运动到偏移点，动作比较简单
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.style['transition'] = 'all .3s linear'
      // 注意css3动画结束有两个触发的事件transitionend/animationend，触发回调函数
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      // 将必要的属性设置为空
      this.$refs.cdWrapper.style[transform] = ''
      this.$refs.cdWrapper.style['transition'] = ''
    },
    timeupdate () {
      this.currentTime = this.$refs.audio.currentTime
    },
    timeChange (precent) {
      let currentTime = precent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
    },
    togglePlayMode () {
      let mode = this.mode
      mode = (mode + 1) % 3 // 在0-2之间循环
      this.setMode(mode) // 改变样式，在改变样式之后，需要改变播放的playList的值
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
      // 这里为什么要分两种情况设置呢，因为有可能是从从随机模式切换到顺序模式，也有可能是从顺序模式切换到随机模式
    },
    resetCurrentIndex (list) { // 这个函数是为了保持在播放模式发生变化后，保持歌曲本身不变
      const id = this.currentSong.id
      const index = list.findIndex(n => id === n.id) // Array.prototype.findIndex((n) => n > 33),通过调用回调函数，来返回符合预期的数组值的索引
      this.setCurrentIndex(index)
    },
    _getPosAndScale () {
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingtop = 80
      const targetWidth = window.innerWidth * 0.8 // 视口宽度80%
      const miniWidth = 40
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingtop - paddingBottom - window.innerWidth / 2
      const scale = miniWidth / targetWidth
      // 返回偏移点坐标
      return {
        x,
        y,
        scale
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.normal-enter,&.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -60%, 0)
        .bottom
          transform: translate3d(0, 60%, 0)
      &.normal-enter-active,&.normal-leave-active
        transition: all .3s
        .top, .bottom
          transition: all .3s cubic-bezier(.79,.14,.63,1.73)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border: 10px solid rgba(255, 255, 255, 0.1)
                border-radius: 50%
                &.play
                  animation rotate 20s linear infinite
                &.pause
                  animation-play-state paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter,&.mini-leave-to
        opacity: 0
      &.mini-enter-active,&.mini-leave-active
        transition: all .3s
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

@keyframes rotate
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)
</style>
