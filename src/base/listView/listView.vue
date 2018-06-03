<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="(group, index) of data"
      :key="index"
      class="list-group" 
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) of group.items"
          :key="index"
          class="list-group-item">
            <img :src="item.pic" alt="" class="avatar">
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut">
      <li v-for="(item, index) of shortcutList"
      :key="index"
      class="item"
      :class="{current: false}"
      >{{item}}</li>
    </ul>
  </scroll>
</template>

<script>
import scroll from '@/base/scroll/scroll.vue'

export default {
  name: 'listView',
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    scroll
  },
  mounted () {

  },
  computed: {
    shortcutList () {
      return this.data.map((val) => {
        return val.title.substr(0, 1)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>