<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import Singer from '@/common/js/singer.js'
import {ERR_OK} from '@/api/config.js'
import listView from '@/base/listView/listView.vue'
import pinyin from 'pinyin'
import {mapMutations} from 'vuex'
import {playlistMixin} from '@/common/js/mixin'

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
  mixins: [playlistMixin],
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
    selectSinger (singer) {
      this.$router.push(`/singer/${singer.mid}`)
      this.setSinger(singer) // 提交mutation，执行方法，修改state中的数据
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // 将this.setSinger() 映射为 this.$store.commit('GET_SINGER')
    }),
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '' // 使用mixins方式插入
      this.$refs.singer.style.bottom = bottom // 这里的style就是针对scroll组件的，因为listView组件的根标签就是scroll组件
      this.$refs.list.refresh() // 这里调用的是listView组件的refersh(),而不是直接调用scroll，因为listView也是基础组件，不能在里面写业务
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
