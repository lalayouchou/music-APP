<template>
  <div class="song-list">
    <ul>
      <li class="item"
      v-for="(song, index) of songList"
      :key="song.id"
      @click="select(song, index)">
        <div class="rank" v-show="rank">
          <div :class="getRankClass(index)">{{getRankText(index)}}</div>
        </div>
        <div class="content">
          <div class="name">{{song.name}}</div>
          <div class="desc">{{song.singer}} • {{song.album}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'songList',
  props: {
    songList: {
      type: Array,
      default () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select (item, index) {
      this.$emit('select', item, index)
    },
    getRankClass (index) {
      if (index <= 2) {
        return `icon icon${index + 1}`
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"

.song-list
  .item
    display: flex
    align-items: center
    box-sizing: border-box
    height: 64px
    font-size: $font-size-medium
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon1
          bg-image('first')
        &.icon2
          bg-image('second')
        &.icon3
          bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>
