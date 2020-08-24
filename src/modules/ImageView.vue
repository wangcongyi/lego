<template>
  <div :class="['m-image-view', { 'f-oh': isOverHidden }]" :style="moduleStyle" v-if="visible">
    <img
      v-if="parseUrl"
      class="imageView-img"
      :src="parseUrl | thumbnail(800)"
      @click.stop="imageJump"
      @load="load"
    />
    <div :class="['imageView-fence', { 'f-abs': !!parseUrl }]" :style="fencesStyle">
      <div
        v-for="(item, index) in fences"
        :class="['fence-item', { 'imageView-pre': pre }]"
        :key="index"
        @click.prevent="go(item.link)"
      >
        <img v-if="item.imageSource" class="full-img" :src="item.imageSource" alt />
        <p v-if="pre">#{{ item.title }}#{{item.link && item.link.desc}}</p>
      </div>
    </div>
    <a
      v-for="(item, index) in items"
      :key="index"
      :style="genStyle({style: item})"
      class="imageView-item"
      :class="pre ? 'imageView-pre' : ''"
      @click.prevent="go(item)"
    >
      <img v-if="item.imageSource" class="full-img" :src="item.imageSource" alt />
      <p v-if="pre">#{{index+1}}#{{item.desc}}</p>
    </a>
    <template v-if="barrageSwitch">
      <Bubble
        ref="bubble"
        :list="barrages"
        :styleOptions="barrageStyle"
        @jump="barrageJump"
        v-if="barrageType === 1"
      />
      <Barrage
        ref="barrage"
        :list="barrages"
        :maxWidth="image.width"
        :maxHeight="image.height"
        :styleOptions="barrageStyle"
        @jump="barrageJump"
        v-if="barrageType === 2"
      />
    </template>
  </div>
</template>
<script>
  import { jumpById } from '@/utils'
  import { genStyle } from '@/modules/super/util'
  import qs from 'qs'
  import config from './ImageView.js'
  import recommend from '@/mixins/recommend'
  import linkTool from '@/mixins/linkTool'
  import Bubble from '@/templates/components/base/Bubble'
  import Barrage from '@/templates/components/base/Barrage'
  import { LINK_CONFIG } from '@/config'

  export default {
    name: 'Image',
    module: '图片热区',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/bf794c00-170e-11ea-ae56-b5039842b49f.png',
    mixins: [recommend, linkTool],
    props: config,
    components: {
      Bubble,
      Barrage,
    },
    watch: {
      styleOptions() {
        console.log(this.styleOptions)
      },
    },
    computed: {
      parseUrl() {
        return this.recommendId ? (this.pre ? this.url : this.dynamicUrl) : this.url
      },
      parseLink() {
        return this.recommendId ? (this.pre ? this.link : this.dynamicLink) : this.link
      },
      isOverHidden() {
        return !!this.parseUrl || !!parseInt(this.moduleStyle.height)
      },
      fencesStyle() {
        return genStyle(this.fencesOptions)
      },
      moduleStyle() {
        return genStyle(this.styleOptions)
      },
    },
    data() {
      return {
        pre: this.$pre,
        visible: false,
        dynamicUrl: '',
        dynamicLink: '',
        image: {
          loaded: false,
          width: null,
          height: null,
        },
      }
    },
    mounted() {
      (this.pre || !this.recommendId) && (this.visible = true)
      !this.pre && this.recommendId && this.getData()
      window.imgv = this
    },
    methods: {
      genStyle,
      // 图片加载
      load(event) {
        const target = event.target
        this.image.loaded = true
        Object.assign(this.image, {
          loaded: true,
          width: target.width,
          height: target.height,
        })
      },
      // 根据资源位初始化数据
      async getData() {
        // TODO 根据资源位请求当前模块是否生效
        // const recommendId = this.recommendId
        // const isEffective = Math.floor(Math.random() * 10) > 4 ? true : false
        // this.visible = this.pre ? true : isEffective
        try {
          const result = await this.getRecommend(this.recommendId)
          const currentTime = result.context.currentTime
          const target = result.list[0]
          const { effectiveStartTime = '', effectiveEndTime = '', link = '', url = '' } = target


          if (effectiveStartTime && effectiveEndTime) {
            this.visible = currentTime >= effectiveStartTime && currentTime <= effectiveEndTime
          } else {
            this.visible = true
          }
          this.dynamicUrl = url
          this.dynamicLink = link
        } catch (error) {
          console.log(error)
        }
      },
      // 消息跳转
      barrageJump({ link: item }) {
        item && this.go(item)
      },
      // 图片链接跳转
      imageJump() {
        if (!this.parseLink) return
        const linkPro = this.parseLink.split('cn')
        const linkNotPro = this.parseLink.split('com')
        const link = linkPro.length > 1 ? linkPro[1] : linkNotPro.length > 1 ? linkNotPro[1] : this.parseLink

        const search = link.split('?')
        const route = search.length > 1 ? search[0] : search[1]
        const target = LINK_CONFIG.find(item => item.h5Link.indexOf(route) > -1)

        if (target) {
          const params = search.length > 1 ? qs.parse(search[search.length - 1]) : {}
          jumpById(target.id, params)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  // zIndex desc
  // hotLink - 2
  // bubble, Barrage - 3

  .m-image-view {
    position: relative;
  }

  .imageView-img {
    width: 100%;
  }

  .imageView-item {
    position: absolute;
    box-sizing: border-box;
    z-index: 2;
    cursor: pointer;
  }

  .imageView-fence {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;

    .fence-item {
      position: relative;
      flex: 1;

      &.imageView-pre {
        p {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
    }
  }

  .imageView-pre {
    border: 1px solid green;
    background: rgba(0, 0, 0, 0.3);

    p {
      text-align: center;
      line-height: 2;
      color: #fff;
    }
  }

  .full-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .barrage {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 20px;
    height: 25px;
    line-height: 25px;
    border-radius: 20px;
    border: 1px solid;
    font-size: 12px;
    transition: transform linear 6s;
    transform: translateX(376px);

    &.slide {
      transform: translateX(-101%);
    }
  }
</style>