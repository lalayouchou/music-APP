<template>
  <div class="singer">
    <list-view :data="singerList" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import Singer from '@/common/js/singer.js'
import {ERR_OK} from '@/api/config.js'
import listView from '@/base/listView/listView.vue'
import pinyin from 'pinyin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  data () {
    return {
      singerList: []
    }
  },
  components: {
    listView
  },
  mounted () {
    getSingerList().then((res) => {
      if (res.code === ERR_OK) {
        this.singerList = res.singerList.data.singerlist
        this.singerList.forEach((val) => {
          this._normalize(val)
        })
        this.singerList = this._normalizeSinger()
      }
    }).catch(e => console.log(e))
  },
  methods: {
    _normalize (val) {
      let name = val['singer_name']
      let index
      if (!/^([A-Za-z])/.test(name)) {
        index = pinyin(name, {
          style: pinyin.STYLE_FIRST_LETTER
        })[0][0].toUpperCase()
      } else {
        index = (RegExp.$1).toUpperCase()
      }
      this.$set(val, 'index', index)
    },
    _normalizeSinger () {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      this.singerList.forEach((val, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(val['singer_id'], val['singer_name'], val['singer_mid']))
        }
        if (!map[val.index]) {
          map[val.index] = {
            title: val.index,
            items: []
          }
        }
        map[val.index]['items'].push(new Singer(val['singer_id'], val['singer_name'], val['singer_mid']))
      })
      let hot = []
      let singer = []
      for (let key in map) {
        if (key === 'hot') {
          hot.push(map[key])
        } else if (/[A-Z]/.test(map[key].title)) {
          singer.push(map[key])
        }
      }
      singer.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(singer)
    },
    selectSinger (item) {
      console.log(item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
