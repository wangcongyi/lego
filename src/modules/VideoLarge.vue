<template>
  <VideoLargeInner v-bind="item" />
</template>

<script>
import config from './VideoLarge.js'
import recommend from '@/mixins/recommend'
import VideoLargeInner from './VideoLargeInner'
export default {
  name: 'VideoLargeOuter',
  module: '视频模块2',
  poster: '',
  mixins: [recommend],
  components: {
    VideoLargeInner
  },
  props: config,
  computed: {
    props () {
      const props = {}
      Object.keys(config).forEach(key => {
        props[key] = this[key]
      })
      return props
    },
    item () {
      return this.recommendId ? (this.pre ? this.dynamicChildList[0] : this.videoInfo) : this.props
    }
  },
  data () {
    return {
      videoInfo: null,
      pre: typeof window !== 'undefined' ? window.ISPRE : false,
    }
  },
  mounted () {
    this.recommendId && !this.pre && this.getData()
  },
  methods: {
    async getData () {
      const { list, context: { currentTime } } = await this.getDynamicRecommend(this.recommendId)
      this.videoInfo = list.length ? list[0] : {}
    }
  }
}
</script>