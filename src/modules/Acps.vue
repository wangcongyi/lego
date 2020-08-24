<template>
  <v-card class="m-acps" width="100%">
    <v-list two-line subheader>
      <v-subheader class="subheader">活动列表</v-subheader>
      <v-btn-toggle v-model="dataSources" color="blue" class="navbar">
        <v-btn value="dev">dev</v-btn>
        <v-btn value="uat">uat</v-btn>
        <v-btn value="fat">fat</v-btn>
        <v-btn value="lpt">lpt</v-btn>
        <v-btn value="prod">pro</v-btn>
        <v-btn value="oth">oth</v-btn>
        <v-btn value="ttai">ttai</v-btn>
      </v-btn-toggle>
      <div class="list">
        <template v-for="(item, index) in list">
          <v-divider :key="index" v-if="index < list.length" />
          <v-list-tile
            v-if="dataSources.toUpperCase() === 'TTAI'"
            :key="`ttai-item-${index}`"
            @click="go(item)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group
            :key="`group-item-${index}`"
            v-model="item.active"
            no-action
            v-else-if="item.items && item.items.length"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.activityName }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    <span class="text--primary">{{ item.activityLevel }}</span> &mdash;
                    <span
                      :class="activityStatusColor(item.status)"
                    >{{ activityStatusStr(item.status) }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile
              v-for="(subItem, subIndex) in item.items"
              :key="`sub-item-${subIndex}`"
              @click="go(subItem)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile :key="`item-${index}`" v-else>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.activityName }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <span class="text--primary">{{ item.activityLevel }}</span> &mdash;
                <span
                  :class="activityStatusColor(item.status)"
                >{{ activityStatusStr(item.status) }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </div>
    </v-list>
    <div :class="['modal fadeInAni', { 'abs': $pre }]" v-if="promptVisible">
      <div class="modalInner prompt">
        <input class="input" type="text" v-model="jumpUrl" />
        <div class="button" @click="goJump">跳转</div>
      </div>
      <img
        class="modalCloseBtn"
        src="https://lego-activity.weilaijishi.cn/resource/0a46db40-26ea-11ea-aa40-99eadaf40669.png"
        alt
        @click="promptVisible = false"
      />
    </div>
    <v-btn
      fab
      dark
      color="indigo"
      :class="['float-btn', { 'abs': $pre }]"
      @click="promptVisible = true"
    >
      <v-icon dark>add</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import Vue from 'vue'
  import { xhr } from '@/utils/request'
  import apix from '@/utils/apix'
  import Vuetify from 'vuetify'
  import 'vuetify/dist/vuetify.min.css'
  import 'material-design-icons-iconfont/dist/material-design-icons.css'

  Vue.use(Vuetify)
  export default {
    name: 'Acps',
    module: '活动列表',
    data() {
      return {
        list: [],
        env: '',
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        // isProd: false,
        dataSources: 'prod',
        promptVisible: false,
        jumpUrl: '',
      }
    },
    computed: {
      OSS_DOMAIN() {
        const ARGVS = this.dataSources
        const DOMAIN_URL = (_ => {
          if (ARGVS === 'prod') {
            return `https://lego-activity.weilaijishi.cn/`
          }
          return `https://lego-activity-${ARGVS}.weilaijishi.com/`
        })()

        return DOMAIN_URL
      },
      XHR_DOMAIN() {
        const ARGVS = this.dataSources
        const DOMAIN_PREFIX_ENV = ARGVS === 'prod' ? '' : `-${ARGVS}`
        const DOMAIN_SUFFIX = ARGVS === 'prod' ? '.cn' : `.com`
        return this.$pre ? 'http://localhost:8080' : `https://lego${DOMAIN_PREFIX_ENV}.weilaijishi${DOMAIN_SUFFIX}`
      },
    },
    watch: {
      dataSources() {
        this._initPageData()
      },
    },
    created() {
      this._initPageData()
    },
    methods: {
      async _initPageData() {
        await this.getInfo()
        this.getList()
      },
      activityStatusColor(status) {
        return status === 1 ? 'red--text' : ''
      },
      activityStatusStr(status) {
        return status === 1 ? '活动生效' : '活动未生效'
      },
      go(item) {
        if (item.link) {
          var url = item.link
        } else {
          if (!item['deployed_prod']) {
            this.$toast('尚未部署，请在PC端进入编辑器部署后再次尝试')
            return
          }
          var time = +new Date()
          var from = (item.pid === 1) ? `&from=${item.name}` : ''
          var url = `${this.OSS_DOMAIN}activity/${this.env === 'development' ? 'test/' : ''}${item.sub_path}/index.html?t=${time}${from}`
        }
        if (this.pre) {
          window.open(url)
        } else {
          location.href = url
        }
      },
      getInfo() {
        const exclude = ['OTH', 'TTAI']
        if (exclude.indexOf(this.dataSources.toUpperCase()) > -1) return
        xhr.get(`${this.XHR_DOMAIN}/api/getInfo`).then(data => {
          this.env = data.msg.env
          localStorage.setItem('ENV', data.msg.env)
        })
      },
      getList() {
        this.$showLoading()
        this.$hide()
        if (this.dataSources.toUpperCase() === 'OTH') {
          this.list = [
            {
              activityLevel: 'S',
              activityName: '定制页面',
              items: [
                {
                  name: '双十一主会场',
                  link: 'https://mall-activity.weilaijishi.cn/shoppingcarnivalmeet/main',
                },
                {
                  name: '超级品牌日',
                  link: 'https://mall-activity.weilaijishi.cn/meet/activity929/',
                },
                {
                  name: '榜单',
                  link: 'https://mall-activity.weilaijishi.cn/septemberactivities/saleslist/',
                },
                {
                  name: '新年幸运签 - fat',
                  link: 'http://mall-activity-fat.weilaijishi.com/newactivities/luckysign',
                },
                {
                  name: '新年幸运签 - uat',
                  link: 'http://mall-activity-uat.weilaijishi.com/newactivities/luckysign',
                },
                {
                  name: '新年幸运签 - dev',
                  link: 'http://mall-activity-dev.weilaijishi.com/newactivities/luckysign',
                },
              ],
              status: 1,
            },
          ]
          this.$hideLoading()
        } else if (this.dataSources.toUpperCase() === 'TTAI') {
          apix.get('/api/ttai/get?pid=131').then(res => {
            if (res.errorCode === 0) {
              this.list = res.result.list
            } else {
              this.list = []
              this.$toast('无数据')
            }
          }).catch(error => {
            this.list = []
            this.$toast('无数据')
          }).then(_ => {
            this.$hideLoading()
          })
        } else {
          xhr.post(`${this.XHR_DOMAIN}/api/activityPages`).then(res => {
            if (res.code === 200) {
              this.list = res.msg.list
            } else {
              this.list = []
              this.$toast('无数据')
            }
          }).catch(error => {
            this.list = []
            this.$toast('无数据')
          }).then(_ => {
            this.$hideLoading()
          })
        }
      },
      goJump() {
        this.jumpUrl && (window.location.href = this.jumpUrl)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .m-acps {
    height: 100%;

    .subheader {
      justify-content: center;
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 111;
      margin: 0 0 20px 0;
    }

    .list {
    }

    .float-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2222;
    }
  }

  .abs {
    position: absolute !important;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color: #000000, $alpha: 0.7);
    z-index: 2222;

    .modalAniBox {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .modalInner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      border-radius: 8px;

      &.prompt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .input {
        margin-right: 10px;

        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
      }

      .button {
        margin-left: 5px;

        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        -webkit-transition: 0.1s;
        transition: 0.1s;
        font-weight: 500;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
      }
    }

    .modalCloseBtn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 34px;
      margin-top: 223px;
    }
  }

  .fadeInAni {
    animation: fadeIn 0.3s forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>