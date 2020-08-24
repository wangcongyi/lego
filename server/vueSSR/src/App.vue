<template>
  <div id="app" data-server-rendered="true">
    <component :is="tpl" :model="model" :share="share" v-if="visible"></component>
  </div>
</template>

<script>
import { getToken, toLogin, getUserInfo, getAppFlag, fetchToken, listenSetLocalStorage } from '@/utils'
import { getRecommends } from '@/mixins/recommend'
export default {
  mounted () {
    this.fetchRecommend()
  },
  data () {
    const tpl = require(`@/templates/${this.tData.tpl}.vue`).default
    return {
      needLogin: false,
      model: this.tData.tModel,
      tpl,
      share: this.tData.share,
      visible: false
    }
  },
  methods: {
    async _initData () {
      await this.fetchRecommend()
      this.fetchUserInfo()
    },
    async fetchUserInfo () {
      const userInfo = await getUserInfo()
      this.getUseModules().forEach(item => {
        if (item.model.hasOwnProperty('userInfo')) {
          item.model.userInfo = userInfo
        }
      })
      this.visible = true
    },
    async fetchRecommend () {
      return new Promise(async (resolve, reject) => {
        const recommendIds = []
        this.getUseModules().forEach(m => {
          m.model.recommendId && recommendIds.push(m.model.recommendId)
        })
        if (!recommendIds.length) {
          !this.needLogin && (this.visible = true)
          resolve()
          return
        }
        (!this.needLogin || this.needLogin && getToken()) && this.$showLoading()
        const result = await getRecommends(recommendIds.join(','))
        sessionStorage.setItem('recommends', JSON.stringify(result))
        !this.needLogin && (this.visible = true)
        resolve()
        this.$hideLoading()
      })
    },
    getUseModules () {
      return this.tData.tModel.filter(m => m.show)
    },
    getLiveList () {
      const liveList = []
      this.getUseModules().forEach(m => {
        m.id === 'ImageView' &&
          m.model.items &&
          m.model.items.length &&
          m.model.items.some(it => it.id === 'live')
        liveList.push(m)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'PingFang SC', 'HanHei SC', 'PingHei', 'Helvetica Neue',
    Helvetica, Arial, 'Microsoft Yahei', 'Hiragino Sans GB', 'Heiti SC',
    'WenQuanYi Micro Hei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
