<template>
  <div
    class="t-base2"
    :class="isMobile?'g-box-mobile':'g-box-pc'"
    id="temp"
    ref="temp"
    v-if="visible"
  >
    <template v-if="pre">
      <div class="content-abs">
        <component
          class="f-relative"
          v-for="({ cmpt, cmptModel }) in componentAbs"
          :is="cmpt"
          :hide="!cmptModel.show"
          v-bind="cmptModel.model"
          :id="cmptModel.mid"
          :key="cmptModel.mid"
        />
      </div>
      <div class="content-fixed">
        <component
          v-for="({ cmpt, cmptModel }) in componentFixed"
          :is="cmpt"
          :hide="!cmptModel.show"
          v-bind="cmptModel.model"
          :id="cmptModel.mid"
          :key="cmptModel.mid"
        />
      </div>
    </template>

    <template v-else>
      <component
        v-for="(item,i) in componentList"
        :is="item && item.cmpt"
        :hide="!model[i].show"
        v-bind="model[i].model"
        :id="model[i].mid"
        :key="model[i].mid"
      />
    </template>
  </div>
</template>

<script>
import apix from '@/utils/apix'
import { setDuration } from '@/utils/storage'
import { trackActivityPage } from '@/utils/tracker'
import { handleActivityStatus } from '@/utils'
export default {
  name: 'BaseTpl',
  data () {
    return {
      isMobile: true,
      visible: false,
      pre: typeof window !== 'undefined' ? window.ISPRE : false,
      trackPager: null
    }
  },
  props: {
    id: [Number, String],
    model: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    componentList () {
      return this.model.map((item) => {
        if (item.show) {
          return {
            cmpt: require(`@/modules/${item.id}.vue`).default,
            cmptModel: item
          }
        }
      })
    },
    componentAbs () {
      return this.componentList.filter(c => c && c.cmptModel && !c.cmptModel.fixed)
    },
    componentFixed () {
      return this.componentList.filter(c => c && c.cmptModel && c.cmptModel.fixed)
    }
  },
  mounted () {
    if (this.pre) {
      this.visible = true
    }
    this.trackPager = trackActivityPage()
    setDuration()
    this.loadFavicon()
    this.getStatus()
  },
  destroyed () {
    this.trackPager && this.trackPager()
  },
  methods: {
    getStatus () {
      if (this.pre) return
      const $aid = document.getElementById('life')
      const aid = $aid.dataset.aid
      $aid.remove()

      apix.get('/api/ttai/get?pid=407').then(res => {
        const currentTime = res.result.context.currentTime
        const { status } = handleActivityStatus(aid.split(';'), currentTime * 1000)
        // // TODO 跳转404
        this.visible = this.pre ? true : !!status
        if (!this.visible) {
          location.replace('https://lego-activity-dev.weilaijishi.com/resource/page/error.html')
        }
      }).catch(error => {
        this.visible = true
      })
    },
    loadFavicon () {
      var link = document.createElement('link')
      link.href = 'https://lego.dydf.cn/resource/34e6b400-a7e7-11ea-87cb-1bf1154e4a9f.ico'
      link.rel = 'shortcut icon'
      link.type = 'image/vnd.microsoft.icon'
      var head = document.querySelector('head')
      head.appendChild(link)
    }
  }
}
</script>

<style lang="scss" scoped>
.f-relative {
  position: relative;
}
.g-box-pc {
  padding-top: 0;
  min-width: 1200px;
}
.g-box-mobile {
  width: 100%;
  overflow-y: auto;
}
.content-abs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  -ms-overflow-style: none;
  z-index: 0;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
}
</style>
