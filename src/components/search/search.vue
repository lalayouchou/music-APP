<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"
      @query="onQueryChange"
      ></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">{{'热门搜索'}}</h1>
          <ul>
            <li
            class="item"
            v-for="item of hotKeyList"
            :key="item.n"
            @click="selectKey(item.k)"
            >{{item.k}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import searchBox from '@/base/search-box/search-box'
import {getHotKey} from '@/api/search'
import {ERR_OK} from '@/api/config'
import suggest from '../suggest/suggest.vue'

export default {
  name: 'Search',
  components: {
    searchBox,
    suggest
  },
  data () {
    return {
      hotKeyList: [],
      query: ''
    }
  },
  created () {
    getHotKey().then((res) => {
      if (res.code === ERR_OK) {
        this.hotKeyList = res.data.hotkey.slice(0, 10)
      }
    }).catch((e) => { console.log(e) })
  },
  methods: {
    selectKey (key) {
      console.log(2)
      this.$refs.searchBox.set(key)
    },
    onQueryChange (query) {
      this.query = query
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
